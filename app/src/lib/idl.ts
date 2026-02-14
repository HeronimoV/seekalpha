// Auto-generated from target/idl/seekalpha.json
export const IDL = {
  "address": "FEiFToWsHmCgjevuw9k8DNS8N8BdVdwTKostmvN9LS8B",
  "metadata": {
    "name": "seekalpha",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "SeekAlpha - Prediction Markets on Solana"
  },
  "instructions": [
    {
      "name": "claim_winnings",
      "discriminator": [161,215,24,59,14,236,242,221],
      "accounts": [
        {"name": "config","pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "market","relations": ["prediction"]},
        {"name": "prediction","writable": true},
        {"name": "vault","writable": true,"pda": {"seeds": [{"kind": "const","value": [118,97,117,108,116]},{"kind": "account","path": "market.id","account": "Market"}]}},
        {"name": "treasury","writable": true},
        {"name": "user","writable": true,"signer": true,"relations": ["prediction"]},
        {"name": "system_program","address": "11111111111111111111111111111111"}
      ],
      "args": []
    },
    {
      "name": "close_flash_market",
      "discriminator": [36,93,151,173,52,232,32,88],
      "accounts": [
        {"name": "market","writable": true},
        {"name": "caller","signer": true}
      ],
      "args": []
    },
    {
      "name": "create_market",
      "discriminator": [103,226,97,235,200,188,251,254],
      "accounts": [
        {"name": "config","writable": true,"pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "market","writable": true,"pda": {"seeds": [{"kind": "const","value": [109,97,114,107,101,116]},{"kind": "account","path": "config.market_count","account": "PlatformConfig"}]}},
        {"name": "vault","pda": {"seeds": [{"kind": "const","value": [118,97,117,108,116]},{"kind": "account","path": "config.market_count","account": "PlatformConfig"}]}},
        {"name": "creator","writable": true,"signer": true},
        {"name": "admin","signer": true,"relations": ["config"]},
        {"name": "system_program","address": "11111111111111111111111111111111"}
      ],
      "args": [
        {"name": "title","type": "string"},
        {"name": "description","type": "string"},
        {"name": "resolution_time","type": "i64"},
        {"name": "market_type","type": {"defined": {"name": "MarketType"}}}
      ]
    },
    {
      "name": "initialize",
      "discriminator": [175,175,109,31,13,152,155,237],
      "accounts": [
        {"name": "config","writable": true,"pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "admin","writable": true,"signer": true},
        {"name": "system_program","address": "11111111111111111111111111111111"}
      ],
      "args": [{"name": "treasury","type": "pubkey"}]
    },
    {
      "name": "place_prediction",
      "discriminator": [79,46,195,197,50,91,88,229],
      "accounts": [
        {"name": "market","writable": true},
        {"name": "prediction","writable": true,"pda": {"seeds": [{"kind": "const","value": [112,114,101,100,105,99,116,105,111,110]},{"kind": "account","path": "market"},{"kind": "account","path": "user"}]}},
        {"name": "vault","writable": true,"pda": {"seeds": [{"kind": "const","value": [118,97,117,108,116]},{"kind": "account","path": "market.id","account": "Market"}]}},
        {"name": "user","writable": true,"signer": true},
        {"name": "system_program","address": "11111111111111111111111111111111"}
      ],
      "args": [
        {"name": "amount","type": "u64"},
        {"name": "position","type": "bool"}
      ]
    },
    {
      "name": "resolve_market",
      "discriminator": [155,23,80,173,46,74,23,239],
      "accounts": [
        {"name": "config","pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "market","writable": true},
        {"name": "admin","signer": true,"relations": ["config"]}
      ],
      "args": [{"name": "outcome","type": "bool"}]
    },
    {
      "name": "update_admin",
      "discriminator": [161,176,40,213,60,184,179,228],
      "accounts": [
        {"name": "config","writable": true,"pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "admin","signer": true,"relations": ["config"]}
      ],
      "args": [{"name": "new_admin","type": "pubkey"}]
    },
    {
      "name": "update_treasury",
      "discriminator": [60,16,243,66,96,59,254,131],
      "accounts": [
        {"name": "config","writable": true,"pda": {"seeds": [{"kind": "const","value": [99,111,110,102,105,103]}]}},
        {"name": "admin","signer": true,"relations": ["config"]}
      ],
      "args": [{"name": "new_treasury","type": "pubkey"}]
    }
  ],
  "accounts": [
    {"name": "Market","discriminator": [219,190,213,55,0,227,198,154]},
    {"name": "PlatformConfig","discriminator": [160,78,128,0,248,83,230,160]},
    {"name": "Prediction","discriminator": [98,127,141,187,218,33,8,14]}
  ],
  "errors": [
    {"code": 6000,"name": "TitleTooLong","msg": "Title too long (max 128 chars)"},
    {"code": 6001,"name": "DescriptionTooLong","msg": "Description too long (max 512 chars)"},
    {"code": 6002,"name": "InvalidResolutionTime","msg": "Resolution time must be in the future"},
    {"code": 6003,"name": "MarketResolved","msg": "Market already resolved"},
    {"code": 6004,"name": "MarketExpired","msg": "Market has expired"},
    {"code": 6005,"name": "MarketNotExpired","msg": "Market not yet expired"},
    {"code": 6006,"name": "MarketNotResolved","msg": "Market not resolved yet"},
    {"code": 6007,"name": "ZeroAmount","msg": "Amount must be greater than 0"},
    {"code": 6008,"name": "AlreadyClaimed","msg": "Winnings already claimed"},
    {"code": 6009,"name": "LostPrediction","msg": "You lost this prediction"},
    {"code": 6010,"name": "PositionMismatch","msg": "Cannot change sides — you already bet the other way"},
    {"code": 6011,"name": "NotFlashMarket","msg": "Not a flash market"}
  ],
  "types": [
    {"name": "Market","type": {"kind": "struct","fields": [
      {"name": "id","type": "u64"},
      {"name": "creator","type": "pubkey"},
      {"name": "title","type": "string"},
      {"name": "description","type": "string"},
      {"name": "yes_pool","type": "u64"},
      {"name": "no_pool","type": "u64"},
      {"name": "resolution_time","type": "i64"},
      {"name": "resolved","type": "bool"},
      {"name": "outcome","type": {"option": "bool"}},
      {"name": "created_at","type": "i64"},
      {"name": "market_type","type": {"defined": {"name": "MarketType"}}},
      {"name": "bump","type": "u8"}
    ]}},
    {"name": "MarketType","type": {"kind": "enum","variants": [
      {"name": "Standard"},
      {"name": "Flash1H"},
      {"name": "Flash24H"}
    ]}},
    {"name": "PlatformConfig","type": {"kind": "struct","fields": [
      {"name": "admin","type": "pubkey"},
      {"name": "treasury","type": "pubkey"},
      {"name": "market_count","type": "u64"},
      {"name": "fee_bps","type": "u16"}
    ]}},
    {"name": "Prediction","type": {"kind": "struct","fields": [
      {"name": "user","type": "pubkey"},
      {"name": "market","type": "pubkey"},
      {"name": "amount","type": "u64"},
      {"name": "position","type": "bool"},
      {"name": "claimed","type": "bool"},
      {"name": "bump","type": "u8"}
    ]}}
  ]
} as const;
