import clientsApi from '@/api/clients'
import apiClient from '@/api/client'

jest.mock('@/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

describe('clients api module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAll calls /api/clients', () => {
    clientsApi.getAll()
    expect(apiClient.get).toHaveBeenCalledWith('/api/clients')
  })

  it('getById calls /api/clients/:id', () => {
    clientsApi.getById('123')
    expect(apiClient.get).toHaveBeenCalledWith('/api/clients/123')
  })

  it('create posts to /api/clients', () => {
    const payload = { name: 'Test Client' }
    clientsApi.create(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/api/clients', payload)
  })

  it('update puts to /api/clients/:id', () => {
    const payload = { name: 'Updated Client' }
    clientsApi.update('123', payload)
    expect(apiClient.put).toHaveBeenCalledWith('/api/clients/123', payload)
  })

  it('delete calls /api/clients/:id', () => {
    clientsApi.delete('123')
    expect(apiClient.delete).toHaveBeenCalledWith('/api/clients/123')
  })
})

