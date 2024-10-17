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
        const tx:string = "020000000001025b8f96219c2e5ee1999db471d2e82c0ab75d85735d6029cb5a7d59ef740f9ec90000000000ffffffff5b8f96219c2e5ee1999db471d2e82c0ab75d85735d6029cb5a7d59ef740f9ec90100000000ffffffff02e8030000000000001600141ef51084a02774cbdf456eb60e72244487bdc4f90d4d0000000000001600141ef51084a02774cbdf456eb60e72244487bdc4f902483045022100dcecc647186f68ff527c23b807c176c99e14a1382b9010a2be61aa5c9885edaa02206ad6720af236eb094267ae750bbc025e52cd1ea64830eb3e0b3cb8cabb196a3a0121037e514eeaaeb01a4e0a5a99d1efac2cd4289277d143433d1a74c0ea6db832cf2502473044022044903b619c00c5dc0727acb03dbadfc75f7197cff0a196eda5aa51899f93a51002202ab55d39a740a5c7fea65151834cf1a088a40d1bba8ac2fedaf98f987d0175410121037e514eeaaeb01a4e0a5a99d1efac2cd4289277d143433d1a74c0ea6db832cf2500000000"
        const result = await sendRawTransaction(tx)
        console.log(result) // c99e0f74ef597d5acb29605d73855db70a2ce8d271b49d99e15e2e9c21968f5b
    })

})