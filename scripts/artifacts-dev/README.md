## CryptoGen

```bash
cryptogen generate --config=./crypto-config.yaml 
```





## ConfigTXGen

### Syntax
```
configtxgen -profile <profile_name> -channelID <channel_name> -outputCreateChannelTx <tx_filename>
```

### Example

#### Generate Genesis Block
```bash
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel/genesis.block
```

#### Generate Channel 
```bash
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel/channel.tx -channelID snackbar-channel
```

#### Generate MSP
```bash
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel/little-factory-msp.tx -channelID snackbar-channel -asOrg little-factory.com
```

```bash
configtxgen -profile  TwoOrgsChannel -outputAnchorPeersUpdate ./channel/little-snackbar-msp.tx -channelID snackbar-channel -asOrg little-factory.com
```
