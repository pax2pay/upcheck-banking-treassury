import { gracely } from "gracely"
import "jest"
import { pax2pay } from "@pax2pay/model-banking"
import { userwidgets } from "@userwidgets/model"
import * as dotenv from "dotenv"

dotenv.config()

const client = process.env.url ? pax2pay.Client.create(process.env.url, "") : undefined
client && (client.realm = "test")
let token: string | gracely.Error

describe("library", () => {
	beforeAll(async () => {
		const key = await client?.userwidgets.me.login({
			user: process.env.email ?? "",
			password: process.env.password ?? "",
		})
		token = userwidgets.User.Key.is(key) ? key.token : gracely.client.unauthorized()
		typeof token == "string" && client && (client.key = token)
	})
	it("get token", async () => {
		expect(typeof token == "string").toBeTruthy()
	})
	it("", async () => {
		const fiat = await client?.treasury.fetch()
		expect(gracely.Error.is(fiat)).toBe(false)
		Object.entries(fiat as pax2pay.Treasury).forEach(balance => {
			expect(balance[1].fiat.safe >= (balance[1].eMoney.actual ?? 0)).toBe(true)
		})
	})
})
