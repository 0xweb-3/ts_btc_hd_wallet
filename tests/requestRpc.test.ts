import {getUTXO, getRecommendedFees, getScriptPubKey, sendRawTransaction} from "../src/requestRpc"


describe("BTC RPC Request", () => {
    test("getUTXO", async () => {
        const data =  await getUTXO("tb1qrm63pp9qya6vhh69d6mquu3ygjrmm38ezzp0dc")

        console.log(data)
    })

    test("getRecommendedFees", async ()=>{
        const result = await getRecommendedFees()

        console.log(result)
    })

    test("getScriptPubKey", async ()=>{
        const result = await getScriptPubKey("tb1qrm63pp9qya6vhh69d6mquu3ygjrmm38ezzp0dc");
        console.log(result.scriptPubKey)
    })

    test("sendRawTransaction", async ()=>{
        const tx:string = "0200000000010244e9e113f86f3dddacf5579de38e7d5b31b1bef5973a2ab60caad808ab79cec00000000000ffffffff44e9e113f86f3dddacf5579de38e7d5b31b1bef5973a2ab60caad808ab79cec00100000000ffffffff02e8030000000000001600141ef51084a02774cbdf456eb60e72244487bdc4f9fc520000000000001600141ef51084a02774cbdf456eb60e72244487bdc4f902473044022004e2bdc010e9c713c7584c1d85cd692c63c21a7475b255aad1770fe28b0f68ba022031959e20604854f67218129550fde0fdc0b33fd1c17a5e09204b2e3ea66128680121037e514eeaaeb01a4e0a5a99d1efac2cd4289277d143433d1a74c0ea6db832cf25024830450221008600b4d1b848bba422665705232025ad90b7af5dd0e1ce734813a0953fc2775602207088ddfcee76ac9f80624fc973bd123b099e08672a6262bc150dd9ca7218eb210121037e514eeaaeb01a4e0a5a99d1efac2cd4289277d143433d1a74c0ea6db832cf2500000000"
        const result = await sendRawTransaction(tx)
        console.log(result) // c99e0f74ef597d5acb29605d73855db70a2ce8d271b49d99e15e2e9c21968f5b
    })

})