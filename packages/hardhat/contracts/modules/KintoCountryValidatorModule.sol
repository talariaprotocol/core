// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../modules/IValidationModule.sol";


/// @title CountryCodes Library
/// @notice A library that provides a list of valid ISO 3166-1 numeric country codes
/// @dev This library contains a single function that returns an array of valid country codes
library CountryCodes {
    /// @notice Returns an array of valid ISO 3166-1 numeric country codes
    /// @return An array of uint16 representing valid country codes
    function getValidCountryCodes() internal pure returns (uint16[] memory) {
        uint16[] memory codes = new uint16[](249);
        codes[0] = 4; // Afghanistan
        codes[2] = 10; // Antarctica
        codes[1] = 8; // Albania
        codes[3] = 12; // Algeria
        codes[4] = 16; // American Samoa
        codes[5] = 20; // Andorra
        codes[6] = 24; // Angola
        codes[7] = 28; // Antigua and Barbuda
        codes[8] = 31; // Azerbaijan
        codes[9] = 32; // Argentina
        codes[10] = 36; // Australia
        codes[11] = 40; // Austria
        codes[12] = 44; // Bahamas
        codes[13] = 48; // Bahrain
        codes[14] = 50; // Bangladesh
        codes[15] = 51; // Armenia
        codes[16] = 52; // Barbados
        codes[17] = 56; // Belgium
        codes[18] = 60; // Bermuda
        codes[19] = 64; // Bhutan
        codes[20] = 68; // Bolivia
        codes[21] = 70; // Bosnia and Herzegovina
        codes[22] = 72; // Botswana
        codes[23] = 74; // Bouvet Island
        codes[24] = 76; // Brazil
        codes[25] = 84; // Belize
        codes[26] = 86; // British Indian Ocean Territory
        codes[27] = 90; // Solomon Islands
        codes[28] = 92; // Virgin Islands (British)
        codes[29] = 96; // Brunei Darussalam
        codes[30] = 100; // Bulgaria
        codes[31] = 104; // Myanmar
        codes[32] = 108; // Burundi
        codes[33] = 112; // Belarus
        codes[34] = 116; // Cambodia
        codes[35] = 120; // Cameroon
        codes[36] = 124; // Canada
        codes[37] = 132; // Cape Verde
        codes[38] = 136; // Cayman Islands
        codes[39] = 140; // Central African Republic
        codes[40] = 144; // Sri Lanka
        codes[41] = 148; // Chad
        codes[42] = 152; // Chile
        codes[43] = 156; // China
        codes[44] = 158; // Taiwan, Province of China
        codes[45] = 162; // Christmas Island
        codes[46] = 166; // Cocos (Keeling) Islands
        codes[47] = 170; // Colombia
        codes[48] = 174; // Comoros
        codes[49] = 175; // Mayotte
        codes[50] = 178; // Congo
        codes[51] = 180; // Congo, the Democratic Republic of the
        codes[52] = 184; // Cook Islands
        codes[53] = 188; // Costa Rica
        codes[54] = 191; // Croatia
        codes[55] = 192; // Cuba
        codes[56] = 196; // Cyprus
        codes[57] = 203; // Czech Republic
        codes[58] = 204; // Benin
        codes[59] = 208; // Denmark
        codes[60] = 212; // Dominica
        codes[61] = 214; // Dominican Republic
        codes[62] = 218; // Ecuador
        codes[63] = 222; // El Salvador
        codes[64] = 226; // Equatorial Guinea
        codes[65] = 231; // Ethiopia
        codes[66] = 232; // Eritrea
        codes[67] = 233; // Estonia
        codes[68] = 234; // Faroe Islands
        codes[69] = 238; // Falkland Islands (Malvinas)
        codes[70] = 239; // South Georgia and the South Sandwich Islands
        codes[71] = 242; // Fiji
        codes[72] = 246; // Finland
        codes[73] = 248; // Åland Islands
        codes[74] = 250; // France
        codes[75] = 254; // French Guiana
        codes[76] = 258; // French Polynesia
        codes[77] = 260; // French Southern Territories
        codes[78] = 262; // Djibouti
        codes[79] = 266; // Gabon
        codes[80] = 268; // Georgia
        codes[81] = 270; // Gambia
        codes[82] = 275; // Palestine, State of
        codes[83] = 276; // Germany
        codes[84] = 288; // Ghana
        codes[85] = 292; // Gibraltar
        codes[86] = 296; // Kiribati
        codes[87] = 300; // Greece
        codes[88] = 304; // Greenland
        codes[89] = 308; // Grenada
        codes[90] = 312; // Guadeloupe
        codes[91] = 316; // Guam
        codes[92] = 320; // Guatemala
        codes[93] = 324; // Guinea
        codes[94] = 328; // Guyana
        codes[95] = 332; // Haiti
        codes[96] = 334; // Heard Island and McDonald Islands
        codes[97] = 336; // Holy See (Vatican City State)
        codes[98] = 340; // Honduras
        codes[99] = 344; // Hong Kong
        codes[100] = 348; // Hungary
        codes[101] = 352; // Iceland
        codes[102] = 356; // India
        codes[103] = 360; // Indonesia
        codes[104] = 364; // Iran, Islamic Republic of
        codes[105] = 368; // Iraq
        codes[106] = 372; // Ireland
        codes[107] = 376; // Israel
        codes[108] = 380; // Italy
        codes[109] = 384; // Côte d'Ivoire
        codes[110] = 388; // Jamaica
        codes[111] = 392; // Japan
        codes[112] = 398; // Kazakhstan
        codes[113] = 400; // Jordan
        codes[114] = 404; // Kenya
        codes[115] = 408; // Korea, Democratic People's Republic of
        codes[116] = 410; // Korea, Republic of
        codes[117] = 414; // Kuwait
        codes[118] = 417; // Kyrgyzstan
        codes[119] = 418; // Lao People's Democratic Republic
        codes[120] = 422; // Lebanon
        codes[121] = 426; // Lesotho
        codes[122] = 428; // Latvia
        codes[123] = 430; // Liberia
        codes[124] = 434; // Libya
        codes[125] = 438; // Liechtenstein
        codes[126] = 440; // Lithuania
        codes[127] = 442; // Luxembourg
        codes[128] = 446; // Macao
        codes[129] = 450; // Madagascar
        codes[130] = 454; // Malawi
        codes[131] = 458; // Malaysia
        codes[132] = 462; // Maldives
        codes[133] = 466; // Mali
        codes[134] = 470; // Malta
        codes[135] = 474; // Martinique
        codes[136] = 478; // Mauritania
        codes[137] = 480; // Mauritius
        codes[138] = 484; // Mexico
        codes[139] = 492; // Monaco
        codes[140] = 496; // Mongolia
        codes[141] = 498; // Moldova, Republic of
        codes[142] = 499; // Montenegro
        codes[143] = 500; // Montserrat
        codes[144] = 504; // Morocco
        codes[145] = 508; // Mozambique
        codes[146] = 512; // Oman
        codes[147] = 516; // Namibia
        codes[148] = 520; // Nauru
        codes[149] = 524; // Nepal
        codes[150] = 528; // Netherlands
        codes[151] = 531; // Curaçao
        codes[152] = 533; // Aruba
        codes[153] = 534; // Sint Maarten (Dutch part)
        codes[154] = 535; // Bonaire, Sint Eustatius and Saba
        codes[155] = 540; // New Caledonia
        codes[156] = 548; // Vanuatu
        codes[157] = 554; // New Zealand
        codes[158] = 558; // Nicaragua
        codes[159] = 562; // Niger
        codes[160] = 566; // Nigeria
        codes[161] = 570; // Niue
        codes[162] = 574; // Norfolk Island
        codes[163] = 578; // Norway
        codes[164] = 580; // Northern Mariana Islands
        codes[165] = 581; // United States Minor Outlying Islands
        codes[166] = 583; // Micronesia, Federated States of
        codes[167] = 584; // Marshall Islands
        codes[168] = 585; // Palau
        codes[169] = 586; // Pakistan
        codes[170] = 591; // Panama
        codes[171] = 598; // Papua New Guinea
        codes[172] = 600; // Paraguay
        codes[173] = 604; // Peru
        codes[174] = 608; // Philippines
        codes[175] = 612; // Pitcairn
        codes[176] = 616; // Poland
        codes[177] = 620; // Portugal
        codes[178] = 624; // Guinea-Bissau
        codes[179] = 626; // Timor-Leste
        codes[180] = 630; // Puerto Rico
        codes[181] = 634; // Qatar
        codes[182] = 638; // Réunion
        codes[183] = 642; // Romania
        codes[184] = 643; // Russian Federation
        codes[185] = 646; // Rwanda
        codes[186] = 652; // Saint Barthélemy
        codes[187] = 654; // Saint Helena, Ascension and Tristan da Cunha
        codes[188] = 659; // Saint Kitts and Nevis
        codes[189] = 660; // Anguilla
        codes[190] = 662; // Saint Lucia
        codes[191] = 663; // Saint Martin (French part)
        codes[192] = 666; // Saint Pierre and Miquelon
        codes[193] = 670; // Saint Vincent and the Grenadines
        codes[194] = 674; // San Marino
        codes[195] = 678; // Sao Tome and Principe
        codes[196] = 682; // Saudi Arabia
        codes[197] = 686; // Senegal
        codes[198] = 688; // Serbia
        codes[199] = 690; // Seychelles
        codes[200] = 694; // Sierra Leone
        codes[201] = 702; // Singapore
        codes[202] = 703; // Slovakia
        codes[203] = 704; // Viet Nam
        codes[204] = 705; // Slovenia
        codes[205] = 706; // Somalia
        codes[206] = 710; // South Africa
        codes[207] = 716; // Zimbabwe
        codes[208] = 724; // Spain
        codes[209] = 728; // South Sudan
        codes[210] = 729; // Sudan
        codes[211] = 732; // Western Sahara
        codes[212] = 740; // Suriname
        codes[213] = 744; // Svalbard and Jan Mayen
        codes[214] = 748; // Eswatini
        codes[215] = 752; // Sweden
        codes[216] = 756; // Switzerland
        codes[217] = 760; // Syrian Arab Republic
        codes[218] = 762; // Tajikistan
        codes[219] = 764; // Thailand
        codes[220] = 768; // Togo
        codes[221] = 772; // Tokelau
        codes[222] = 776; // Tonga
        codes[223] = 780; // Trinidad and Tobago
        codes[224] = 784; // United Arab Emirates
        codes[225] = 788; // Tunisia
        codes[226] = 792; // Turkey
        codes[227] = 795; // Turkmenistan
        codes[228] = 796; // Turks and Caicos Islands
        codes[229] = 798; // Tuvalu
        codes[230] = 800; // Uganda
        codes[231] = 804; // Ukraine
        codes[232] = 807; // North Macedonia
        codes[233] = 818; // Egypt
        codes[234] = 826; // United Kingdom
        codes[235] = 831; // Guernsey
        codes[236] = 832; // Jersey
        codes[237] = 833; // Isle of Man
        codes[238] = 834; // Tanzania, United Republic of
        codes[239] = 840; // United States
        codes[240] = 850; // Virgin Islands (U.S.)
        codes[241] = 854; // Burkina Faso
        codes[242] = 858; // Uruguay
        codes[243] = 860; // Uzbekistan
        codes[244] = 862; // Venezuela, Bolivarian Republic of
        codes[245] = 876; // Wallis and Futuna
        codes[246] = 882; // Samoa
        codes[247] = 887; // Yemen
        codes[248] = 894; // Zambia
        return codes;
    }
}

interface KYCViewer {
  struct UserInfo {
        /// @notice The ETH balance of the user's EOA (Externally Owned Account)
        uint256 ownerBalance;
        /// @notice The ETH balance of the user's Kinto wallet
        uint256 walletBalance;
        /// @notice The policy governing the wallet's signers (e.g., number of required signatures)
        uint256 walletPolicy;
        /// @notice Array of addresses that own the wallet
        address[] walletOwners;
        /// @notice Amount of ETH claimed from the faucet
        bool claimedFaucet;
        /// @notice Indicates whether the user has a Kinto ID NFT
        bool hasNFT;
        /// @notice Total Engen Credits earned by the user
        uint256 engenCreditsEarned;
        /// @notice Amount of Engen Credits claimed by the user
        uint256 engenCreditsClaimed;
        /// @notice Indicates whether the user has completed KYC
        bool isKYC;
        /// @notice Timestamp of when the wallet entered recovery mode (0 if not in recovery)
        uint256 recoveryTs;
        /// @notice The insurance policy of the wallet (details depend on implementation)
        uint256 insurancePolicy;
        /// @notice Indicates whether the wallet has a valid insurance policy
        bool hasValidInsurance;
        /// @notice Timestamp of when the insurance policy was last updated
        uint256 insuranceTimestamp;
        /// @notice Address of the EOA that deployed the wallet (if applicable)
        address deployer;
    }


  function isKYC(address _address) external view returns (bool);

function isSanctionsSafe(address _account) external view returns (bool);

function isSanctionsSafeIn(address _account, uint16 _countryId) external view returns (bool);

function isCompany(address _account) external view returns (bool);

function isIndividual(address _account) external view returns (bool);

function hasTrait(address _account, uint16 _traitId) external view returns (bool);

function getCountry(address account) external view returns (uint16);

function getUserInfo(address _account, address payable _wallet) external view returns (UserInfo memory info);

function getBalances(address[] memory tokens, address target) external view returns (uint256[] memory balances);
}

// This validator checks for Argentinean users
contract KintoCountryValidatorModule is IValidationModule {

  address public KYCViewerAddress;
  uint16 public country;

  constructor(address _KYCViewerAddress) {
    KYCViewerAddress = _KYCViewerAddress; 

    country = 32; // Argentina
  }

  function validate(bytes calldata arg) external override returns (bool) {

    require( KYCViewer(KYCViewerAddress).getCountry(msg.sender) == country, "User is not from Argentina");
    
    return true;
  }
}