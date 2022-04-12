import app from "../server"

import request from "supertest"
import { BigfishData } from "../app/main/operations"
import { LedgerData } from "../app/main/bigmaps"

describe("get /recent/bigfish", () => {
    it("returns bigfish data", async () => {
        const res = await request(app)
            .get('/recent/bigfish')
        const bigfishData: BigfishData[] = res.body
        expect(bigfishData.length).toBeGreaterThan(0)
        bigfishData.forEach((bigfishResult) => {
            expect(bigfishResult.usdPrice).toBeGreaterThan(0)
            expect(bigfishResult.transaction_operation?.source_address).not.toBeNull()
            expect(bigfishResult.transaction_operation?.destination_address).not.toBeNull()
            expect(bigfishResult.transaction_operation?.entrypoint).not.toBeNull()
            expect(bigfishResult.transaction_operation?.operation_hash).not.toBeNull()
            expect(bigfishResult.block.hash).not.toBeNull()
            expect(bigfishResult.block.timestamp).not.toBeNull()
            expect(bigfishResult.block.level).not.toBeNull()
            expect(bigfishResult.transaction_operation?.kind).toEqual('transaction')
        })
    })
})

describe("post /recent/ledgers", () => {
    it("returns ledger data", async () => {
        const res = await request(app)
            .post('/recent/ledgers')
            .send({ contract_metdata: true, contract_origination: true })
        const ledgerData: LedgerData[] = res.body.data
        expect(ledgerData.length).toBeGreaterThan(0)
        ledgerData.forEach((ledgerResult) => {
            expect(ledgerResult.cursor).not.toBeNull();
            expect(ledgerResult.annots).toBe('%ledger');
            expect(ledgerResult.block.hash).not.toBeNull()
            expect(ledgerResult.block.timestamp).not.toBeNull()
            expect(ledgerResult.block.level).not.toBeNull()
            expect(ledgerResult.contract.address).not.toBeNull()
            expect(ledgerResult.origination_operation?.contract_address).not.toBeNull()
            expect(ledgerResult.contract.address === ledgerResult.origination_operation?.contract_address).toEqual(true)
            expect(ledgerResult.origination_operation?.creator_address).not.toBeNull()
            expect(ledgerResult.origination_operation?.operation_hash).not.toBeNull()
        })
    })
})
