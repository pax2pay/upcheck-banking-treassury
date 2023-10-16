import { gracely } from "gracely"
import { isoly } from "isoly"
import "jest"
import { pax2pay } from "@pax2pay/model-banking"
import * as dotenv from "dotenv"

dotenv.config()
jest.setTimeout(15000)

const client = process.env.url ? pax2pay.Client.create(process.env.url, "") : undefined
client && (client.realm = "testUK")
let token: string | gracely.Error

describe("Compare fiat and e-money", () => {
	beforeAll(async () => {
		const key = await client?.userwidgets.me.login({
			user: process.env.email ?? "",
			password: process.env.password ?? "",
		})
		token = !gracely.Error.is(key) && key?.token ? key.token : gracely.client.unauthorized()
		!gracely.Error.is(token) && client && (client.key = token)
	})
	it("get token", async () => {
		expect(typeof token == "string").toBeTruthy()
	})
	it("e-money less or equal to safeguarded funds", async () => {
		const fiat = await client?.treasury.fetch(isoly.DateTime.now())
		expect(gracely.Error.is(fiat)).toBe(false)
		console.log(fiat)
		Object.entries(fiat as pax2pay.Treasury).forEach(balance =>
			expect(balance[1].fiat.safe).toBeGreaterThanOrEqual(balance[1].emoney.actual ?? 0)
		)
	})
})
