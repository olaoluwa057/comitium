/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { DiamondCutFacet } from "./DiamondCutFacet";

export class DiamondCutFacetFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<DiamondCutFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondCutFacet>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DiamondCutFacet {
    return super.attach(address) as DiamondCutFacet;
  }
  connect(signer: Signer): DiamondCutFacetFactory {
    return super.connect(signer) as DiamondCutFacetFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondCutFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondCutFacet;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506121c1806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80631f931c1c14610030575b600080fd5b61004a600480360381019061004591906112fe565b61004c565b005b61005461025a565b600061005e6102f5565b60010180549050905060005b868690508110156101c45761007d61118c565b87878381811061008957fe5b905060200281019061009b9190611e77565b60200160208101906100ad9190611387565b816020019060028111156100bd57fe5b908160028111156100ca57fe5b815250508787838181106100da57fe5b90506020028101906100ec9190611e77565b60000160208101906100fe91906112d5565b816000019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505087878381811061014157fe5b90506020028101906101539190611e77565b80604001906101629190611e20565b80806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505081604001819052506101b48382610322565b925050808060010191505061006a565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb67386868686866040516101fc959493929190611bd5565b60405180910390a16102528484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506105ee565b505050505050565b6102626102f5565b60030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ea90611e00565b60405180910390fd5b565b6000807fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c90508091505090565b6000808260400151511161036b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036290611d00565b60405180910390fd5b6000600281111561037857fe5b8260200151600281111561038857fe5b141561043957600073ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161415610402576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f990611cc0565b60405180910390fd5b610428826000015160405180606001604052806024815260200161216860249139610802565b6104328383610854565b90506105e8565b6001600281111561044657fe5b8260200151600281111561045657fe5b141561050757600073ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff1614156104d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c790611c80565b60405180910390fd5b6104f6826000015160405180606001604052806027815260200161214160279139610802565b6105008383610ad9565b90506105e8565b60028081111561051357fe5b8260200151600281111561052357fe5b14156105ad57600073ffffffffffffffffffffffffffffffffffffffff16826000015173ffffffffffffffffffffffffffffffffffffffff161461059c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059390611d20565b60405180910390fd5b6105a68383610d92565b90506105e8565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105df90611ce0565b60405180910390fd5b92915050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561066c576000815114610667576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065e90611c40565b60405180910390fd5b6107fe565b60008151116106b0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106a790611d40565b60405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614610706576107058260405180606001604052806028815260200161211960289139610802565b5b600060608373ffffffffffffffffffffffffffffffffffffffff168360405161072f9190611bbe565b600060405180830381855af49150503d806000811461076a576040519150601f19603f3d011682016040523d82523d6000602084013e61076f565b606091505b5091509150816107fb576000815111156107c057806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b79190611c1e565b60405180910390fd5b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107f290611c60565b60405180910390fd5b50505b5050565b6000823b905060008111829061084e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108459190611c1e565b60405180910390fd5b50505050565b60008061085f6102f5565b905060005b836040015151811015610ace5760008460400151828151811061088357fe5b602002602001015190506000836000016000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610977576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096e90611d60565b60405180910390fd5b6040518060400160405280876000015173ffffffffffffffffffffffffffffffffffffffff1681526020018861ffff16815250846000016000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548161ffff021916908361ffff160217905550905050836001018290806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908360e01c0217905550868060010197505050508080600101915050610864565b508391505092915050565b600080610ae46102f5565b905060005b836040015151811015610d8757600084604001518281518110610b0857fe5b602002602001015190506000836000016000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610bfc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bf390611da0565b60405180910390fd5b856000015173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610c6f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c6690611d80565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610cdf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cd690611de0565b60405180910390fd5b8560000151846000016000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050508080600101915050610ae9565b508391505092915050565b600080610d9d6102f5565b905060005b83604001515181101561118157600084604001518281518110610dc157fe5b60200260200101519050610dd36111ce565b836000016000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206040518060400160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016000820160149054906101000a900461ffff1661ffff1661ffff16815250509050600073ffffffffffffffffffffffffffffffffffffffff16816000015173ffffffffffffffffffffffffffffffffffffffff161415610f1d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1490611ca0565b60405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff16816000015173ffffffffffffffffffffffffffffffffffffffff161415610f90576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8790611dc0565b60405180910390fd5b60018703816020015161ffff161461109a576000846001016001890381548110610fb657fe5b90600052602060002090600891828204019190066004029054906101000a900460e01b90508085600101836020015161ffff1681548110610ff357fe5b90600052602060002090600891828204019190066004026101000a81548163ffffffff021916908360e01c02179055508160200151856000016000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160146101000a81548161ffff021916908361ffff160217905550505b836001018054806110a757fe5b60019003818190600052602060002090600891828204019190066004026101000a81549063ffffffff02191690559055836000016000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549061ffff0219169055505086806001900397505050508080600101915050610da2565b508391505092915050565b6040518060600160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600060028111156111c157fe5b8152602001606081525090565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600061ffff1681525090565b600081359050611211816120da565b92915050565b60008083601f84011261122957600080fd5b8235905067ffffffffffffffff81111561124257600080fd5b60208301915083602082028301111561125a57600080fd5b9250929050565b600081359050611270816120f1565b92915050565b60008083601f84011261128857600080fd5b8235905067ffffffffffffffff8111156112a157600080fd5b6020830191508360018202830111156112b957600080fd5b9250929050565b6000813590506112cf81612108565b92915050565b6000602082840312156112e757600080fd5b60006112f584828501611202565b91505092915050565b60008060008060006060868803121561131657600080fd5b600086013567ffffffffffffffff81111561133057600080fd5b61133c88828901611217565b9550955050602061134f88828901611202565b935050604086013567ffffffffffffffff81111561136c57600080fd5b61137888828901611276565b92509250509295509295909350565b60006020828403121561139957600080fd5b60006113a7848285016112c0565b91505092915050565b60006113bc83836114cb565b60208301905092915050565b60006113d48383611b54565b905092915050565b6113e581611fee565b82525050565b6113f481611fee565b82525050565b60006114068385611edf565b935061141182611e9b565b8060005b8581101561144a576114278284611f9c565b61143188826113b0565b975061143c83611ec5565b925050600181019050611415565b5085925050509392505050565b60006114638385611ef0565b93508360208402850161147584611ea5565b8060005b878110156114b95784840389526114908284611fca565b61149a85826113c8565b94506114a583611ed2565b925060208a01995050600181019050611479565b50829750879450505050509392505050565b6114d481612000565b82525050565b60006114e68385611f01565b93506114f3838584612071565b6114fc836120b5565b840190509392505050565b600061151282611eaf565b61151c8185611f12565b935061152c818560208601612080565b80840191505092915050565b6115418161205f565b82525050565b600061155282611eba565b61155c8185611f1d565b935061156c818560208601612080565b611575816120b5565b840191505092915050565b600061158d603c83611f1d565b91507f4c69624469616d6f6e644375743a205f696e697420697320616464726573732860008301527f3029206275745f63616c6c64617461206973206e6f7420656d707479000000006020830152604082019050919050565b60006115f3602683611f1d565b91507f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e20726560008301527f76657274656400000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611659603483611f1d565b91507f4c69624469616d6f6e643a2072656d6f7665206661636574206164647265737360008301527f2063616e277420626520616464726573732830290000000000000000000000006020830152604082019050919050565b60006116bf603783611f1d565b91507f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360008301527f74696f6e207468617420646f65736e27742065786973740000000000000000006020830152604082019050919050565b6000611725603183611f1d565b91507f4c69624469616d6f6e643a20616464206661636574206164647265737320636160008301527f6e277420626520616464726573732830290000000000000000000000000000006020830152604082019050919050565b600061178b602783611f1d565b91507f4c69624469616d6f6e644375743a20496e636f7272656374204661636574437560008301527f74416374696f6e000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006117f1602883611f1d565b91507f4c69624469616d6f6e643a204e6f2073656c6563746f727320696e206661636560008301527f7420746f206375740000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611857603383611f1d565b91507f4c69624469616d6f6e643a2072656d6f7665206661636574206164647265737360008301527f206d7573742062652061646472657373283029000000000000000000000000006020830152604082019050919050565b60006118bd603d83611f1d565b91507f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707460008301527f7920627574205f696e6974206973206e6f7420616464726573732830290000006020830152604082019050919050565b6000611923603583611f1d565b91507f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f60008301527f6e207468617420616c72656164792065786973747300000000000000000000006020830152604082019050919050565b6000611989603883611f1d565b91507f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60008301527f6374696f6e20776974682073616d652066756e6374696f6e00000000000000006020830152604082019050919050565b60006119ef602f83611f1d565b91507f4c69624469616d6f6e644375743a2043616e2774207265706c61636520696d6d60008301527f757461626c652066756e6374696f6e00000000000000000000000000000000006020830152604082019050919050565b6000611a55602f83611f1d565b91507f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560008301527f7461626c652066756e6374696f6e2e00000000000000000000000000000000006020830152604082019050919050565b6000611abb603883611f1d565b91507f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60008301527f6374696f6e207468617420646f65736e277420657869737400000000000000006020830152604082019050919050565b6000611b21601683611f1d565b91507f4d75737420626520636f6e7472616374206f776e6572000000000000000000006000830152602082019050919050565b600060608301611b676000840184611f2e565b611b7460008601826113dc565b50611b826020840184611fb3565b611b8f6020860182611538565b50611b9d6040840184611f45565b8583036040870152611bb08382846113fa565b925050508091505092915050565b6000611bca8284611507565b915081905092915050565b60006060820190508181036000830152611bf0818789611457565b9050611bff60208301866113eb565b8181036040830152611c128184866114da565b90509695505050505050565b60006020820190508181036000830152611c388184611547565b905092915050565b60006020820190508181036000830152611c5981611580565b9050919050565b60006020820190508181036000830152611c79816115e6565b9050919050565b60006020820190508181036000830152611c998161164c565b9050919050565b60006020820190508181036000830152611cb9816116b2565b9050919050565b60006020820190508181036000830152611cd981611718565b9050919050565b60006020820190508181036000830152611cf98161177e565b9050919050565b60006020820190508181036000830152611d19816117e4565b9050919050565b60006020820190508181036000830152611d398161184a565b9050919050565b60006020820190508181036000830152611d59816118b0565b9050919050565b60006020820190508181036000830152611d7981611916565b9050919050565b60006020820190508181036000830152611d998161197c565b9050919050565b60006020820190508181036000830152611db9816119e2565b9050919050565b60006020820190508181036000830152611dd981611a48565b9050919050565b60006020820190508181036000830152611df981611aae565b9050919050565b60006020820190508181036000830152611e1981611b14565b9050919050565b60008083356001602003843603038112611e3957600080fd5b80840192508235915067ffffffffffffffff821115611e5757600080fd5b602083019250602082023603831315611e6f57600080fd5b509250929050565b600082356001606003833603038112611e8f57600080fd5b80830191505092915050565b6000819050919050565b6000819050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b6000611f3d6020840184611202565b905092915050565b60008083356001602003843603038112611f5e57600080fd5b83810192508235915060208301925067ffffffffffffffff821115611f8257600080fd5b602082023603841315611f9457600080fd5b509250929050565b6000611fab6020840184611261565b905092915050565b6000611fc260208401846112c0565b905092915050565b600082356001606003833603038112611fe257600080fd5b82810191505092915050565b6000611ff98261203f565b9050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600081905061203a826120c6565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061206a8261202c565b9050919050565b82818337600083830152505050565b60005b8381101561209e578082015181840152602081019050612083565b838111156120ad576000848401525b50505050565bfe5b6000601f19601f8301169050919050565b600381106120d7576120d66120b3565b5b50565b6120e381611fee565b81146120ee57600080fd5b50565b6120fa81612000565b811461210557600080fd5b50565b6003811061211557600080fd5b5056fe4c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e643a2072656d6f7665206661636574206d757374206861766520636f64654c69624469616d6f6e643a20616464206661636574206d757374206861766520636f6465a26469706673582212202ad204818b2219af28d3a2fd773e30e82fe868efa6d284571577475f11630c0064736f6c63430007030033";
