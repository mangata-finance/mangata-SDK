/* eslint-disable no-console */
import { mangataInstance } from './mangataInstanceCreation'

describe('Chain, Node and Version', () => {
  it('should retrive chain name when calling getChain method', async () => {
    const chain = await mangataInstance.getChain()
    expect(chain).toEqual('Development')
  })

  it('should match version 0.4.0 node version when calling getNodeVersion method', async () => {
    const version = '0.4.0'
    const nodeVersion = await mangataInstance.getNodeVersion()
    expect(nodeVersion).toMatch(new RegExp(`^${version}?`))
  })

  it('should match name when calling getNodeName method', async () => {
    const name = 'Substrate'
    const nodeName = await mangataInstance.getNodeName()
    expect(nodeName).toMatch(new RegExp(`^${name}?`))
  })
})

afterAll(async () => {
  await mangataInstance.disconnect()
})
