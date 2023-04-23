import { readEnv } from "../state";
import fetch from 'node-fetch'

export async function searchWolfram(query: string) {
  const encoded = encodeURIComponent(query)

  const resp = await fetch(`http://api.wolframalpha.com/v1/result?appid=${readEnv("WOLFRAM_APPID")}&i=${encoded}`)

  return await resp.text()
}
