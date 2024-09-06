// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ETHTransfer.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";

import { ILayerZeroEndpointV2, Origin, MessagingFee } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

contract AddressFreeBridge is ETHTransfer, Ownable, OApp, OAppOptionsType3 {
    address public immutable lzEndpoint;

    // Mapping for metadata
    mapping(bytes32 => string) public metadata;

    event Success(bool success);
    event BridgeCreated(bytes32 commitment, string metadata);
    event BridgeConsumed(bytes32 commitment, address to);
    event ValueTransferred(uint256 value, address to);
    
    /// @notice Message types that are used to identify the various OApp operations.
    uint16 public constant MESSAGE_TYPE_SEND = 1;
    uint16 public constant MESSAGE_TYPE_RETURN = 2;

    /// @notice Emitted when a return message is successfully sent (B -> A).
    event ReturnMessageSent(bytes message, uint32 dstEid);

    /// @notice Emitted when a message is received from another chain.
    event MessageReceived(bytes message, uint32 senderEid, bytes32 sender);

     /// @notice Emitted when a message is sent to another chain (A -> B).
    event MessageSent(bytes message, uint32 dstEid);

    /// @dev Revert with this error when an invalid message type is used.
    error InvalidMsgType();

    constructor(
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight,
        address _lzEndpoint,
        address _lzExecutor
    ) ETHTransfer(_verifier, _hasher, _merkleTreeHeight) OApp(_lzEndpoint, _lzExecutor) Ownable(msg.sender)  {
        lzEndpoint = _lzEndpoint;
    }

    function createBridge(bytes32 _commitment, address[] calldata _validationModules, string memory _metadata) public payable {
        metadata[_commitment] = _metadata;
        super.createTransfer(_commitment, _validationModules);
    
        emit BridgeCreated(_commitment, _metadata);
    }

    /**
     * @notice Sends a message from the source to destination chain.
     * @param _dstEid Destination chain's endpoint ID.
     * @param _payload The payload to send.
     * @param _options Message execution options (e.g., for sending gas to destination).
     */
    function send(
        uint32 _dstEid,
        bytes memory _payload,
        bytes calldata _options
    ) public payable {
        _lzSend(
            _dstEid,
            _payload,
            _options,
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );
    }
    receive() external payable {}

    function consumeBridgeInCurrentChain(
        bytes32 _commitment,
        bytes memory _proof,
        bytes32 _root,
        bytes32 _nullifierHash,
        address payable _to,
        bytes[] memory _validationsArgs

    ) public {
        consumeTransfer(_commitment, _proof, _root, _nullifierHash, _to, _validationsArgs, false);

        emit BridgeConsumed(_commitment, _to);
    }

  function encodeMessage(bytes memory _payload, uint16 _msgType, bytes memory _extraReturnOptions) public pure returns (bytes memory) {
        // Get the length of _extraReturnOptions
        uint256 extraOptionsLength = _extraReturnOptions.length;

        bytes memory encoded = abi.encode(_msgType, extraOptionsLength, _extraReturnOptions, _payload);
        
        return encoded;
    }

    function decodeMessage(bytes calldata encodedMessage) public pure returns (uint16 msgType, uint256 extraOptionsLength, bytes memory options, bytes memory payload) {
        uint16 _msgType;

        // Decode the first part of the message
        (_msgType, extraOptionsLength, options, payload) = abi.decode(encodedMessage, (uint16, uint256, bytes, bytes));


        return (_msgType, extraOptionsLength, options, payload);
    }



    function quote(
        bytes32 _commitment,
        bytes memory _proof,
        bytes32 _root,
        bytes32 _nullifierHash,
        address payable _to,
        bytes[] memory _validationsArgs, 
    
        uint32 _dstEid, 
        bytes calldata _options,
        bytes memory _returnOptions 
    ) public view returns (MessagingFee memory fee) {
        ConsumeMessage memory _message = ConsumeMessage({
            commitment: _commitment,
            proof: _proof,
            root: _root,
            nullifier: _nullifierHash,
            to: _to,
            sender: payable(msg.sender),
            validationArgs: _validationsArgs,
            chainBdest: payable (msg.sender),
            options: _options
        });
        bytes memory payload = encodeMessage(abi.encode(_message), MESSAGE_TYPE_RETURN, _returnOptions);
        bytes memory options = combineOptions(_dstEid, MESSAGE_TYPE_SEND, _options);

        fee = _quote(_dstEid, payload, options, false);
    }



    /**
     * Consumes a bridge in chain B
     * 
     * @param _dstEid Destination chain's endpoint ID.
     */
    function consumeBridge(
        bytes32 _commitment,
        bytes memory _proof,
        bytes32 _root,
        bytes32 _nullifierHash,
        address payable _to,
        bytes[] memory _validationsArgs, 
        uint32 _dstEid,
        bytes calldata _options,
        bytes memory _returnOptions
    ) public payable {
        ConsumeMessage memory data = ConsumeMessage({
            commitment: _commitment,
            proof: _proof,
            root: _root,
            nullifier: _nullifierHash,
            to: _to,
            sender: payable(msg.sender),
            validationArgs: _validationsArgs,
            chainBdest: payable (msg.sender),
            options: _options
        });

        bytes memory message =  abi.encode(data);

        bytes memory _payload = encodeMessage(message, MESSAGE_TYPE_SEND, _returnOptions);
    
        send(
            _dstEid,
            _payload,
            _options
        );

        emit MessageSent(_payload, _dstEid);
    }

    struct ConsumeMessage {
        bytes32 commitment;
        bytes proof;
        bytes32 root;
        bytes32 nullifier;
        address payable sender;
        address payable to;
        bytes[] validationArgs;
        address payable chainBdest;
        bytes options;
    }

    struct ReturnMessage {
        uint256 value;
        address payable chainBdest;
    }

    function sliceBytes(bytes memory data, uint256 start, uint256 length) internal pure returns (bytes memory) {
        require(data.length >= start + length, "Slice out of range");

        bytes memory tempBytes = new bytes(length);

        for (uint256 i = 0; i < length; i++) {
            tempBytes[i] = data[start + i];
        }

        return tempBytes;
    }



    function customCombineOptions(
        uint32 _eid,
        uint16 _msgType,
        bytes memory _extraOptions
    ) public view virtual returns (bytes memory) {
        bytes memory enforced = enforcedOptions[_eid][_msgType];

        // No enforced options, pass whatever the caller supplied, even if it's empty or legacy type 1/2 options.
        if (enforced.length == 0) return _extraOptions;

        // No caller options, return enforced
        if (_extraOptions.length == 0) return enforced;

        // @dev If caller provided _extraOptions, must be type 3 as its the ONLY type that can be combined.
        if (_extraOptions.length >= 2) {
            _assertOptionsType3(_extraOptions);
            // @dev Remove the first 2 bytes containing the type from the _extraOptions and combine with enforced.
            bytes memory sliced = sliceBytes(_extraOptions, 2, _extraOptions.length - 2);

            return bytes.concat(enforced, sliced);
        }

        // No valid set of options was found.
        revert InvalidOptions(_extraOptions);
    }

    function consumeBridgeByPayload (
        bytes memory _payload
    ) internal returns (ReturnMessage memory) {
        ConsumeMessage memory consumeData = abi.decode(_payload, (ConsumeMessage));

        uint256 value = transferValues[consumeData.commitment];

        consumeBridgeInCurrentChain(
            consumeData.commitment,
            consumeData.proof,
            consumeData.root,
            consumeData.nullifier,
            consumeData.to,
            consumeData.validationArgs
        );

        ReturnMessage memory newMessage = ReturnMessage({
                value: value,
                chainBdest: consumeData.chainBdest
        });

        return newMessage;
    }

    /**
     * @dev Called when data is received from the protocol. It overrides the equivalent function in the parent contract.
     * Protocol messages are defined as packets, comprised of the following parameters.
     * @param _origin A struct containing information about where the packet came from.
     * @param _guid A global unique identifier for tracking the packet.
     * @param message Encoded message.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata message,
        address _executor,  // Executor address as specified by the OApp.
        bytes calldata options  // Any extra data or options to trigger on receipt.
    ) internal override {
        (uint16 msgType, uint256 optionsLength, bytes memory extraOptions, bytes memory payload) = decodeMessage(message);


        if (msgType == MESSAGE_TYPE_SEND) {
            // Received consume message from chain B
            
            ReturnMessage memory newMessage = consumeBridgeByPayload(payload);

            bytes memory newOptions = customCombineOptions(_origin.srcEid, MESSAGE_TYPE_RETURN, extraOptions);
            bytes memory _returnPayload = encodeMessage(abi.encode(newMessage), MESSAGE_TYPE_RETURN, "");
          
            _lzSend(
                _origin.srcEid,
                _returnPayload,
                newOptions,
                MessagingFee(msg.value, 0), 
                address(this) // Refund address
            );

        } else if (msgType == MESSAGE_TYPE_RETURN) {
            // Received return message from chain A
            ReturnMessage memory returnData = abi.decode(payload, (ReturnMessage));

            address payable to = returnData.chainBdest;
            (bool success, ) = to.call{ value: returnData.value }("");
            require(success, "payment to _to did not go thru");

            emit ValueTransferred(returnData.value, to);
        } else {
            revert InvalidMsgType();
        }
    }
}
