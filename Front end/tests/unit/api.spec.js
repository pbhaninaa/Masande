import api from '@/api';
import axios from 'axios';

jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('login should call correct endpoint with credentials', async () => {
      const credentials = {
        username: 'test@example.com',
        password: 'password123'
      };
      const response = { data: { token: 'test-token', user: { id: 1 } } };

      axios.post.mockResolvedValue(response);

      const result = await api.login(credentials);

      expect(axios.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(response.data);
    });

    it('register should call correct endpoint with user data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      const response = { data: { user: { id: 1 } } };

      axios.post.mockResolvedValue(response);

      const result = await api.register(userData);

      expect(axios.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(response.data);
    });
  });

  describe('Tenant API', () => {
    it('getTenants should fetch all tenants', async () => {
      const tenants = [
        { id: 1, name: 'Tenant 1' },
        { id: 2, name: 'Tenant 2' }
      ];
      axios.get.mockResolvedValue({ data: tenants });

      const result = await api.getTenants();

      expect(axios.get).toHaveBeenCalledWith('/tenants');
      expect(result).toEqual(tenants);
    });

    it('getTenantById should fetch single tenant', async () => {
      const tenant = { id: 1, name: 'Tenant 1' };
      axios.get.mockResolvedValue({ data: tenant });

      const result = await api.getTenantById(1);

      expect(axios.get).toHaveBeenCalledWith('/tenants/1');
      expect(result).toEqual(tenant);
    });

    it('createTenant should post tenant data', async () => {
      const tenantData = {
        tenantName: 'New Tenant',
        tenantCode: 'NEW_TENANT',
        adminEmail: 'admin@test.com'
      };
      const response = { data: { id: 1, ...tenantData } };

      axios.post.mockResolvedValue(response);

      const result = await api.createTenant(tenantData);

      expect(axios.post).toHaveBeenCalledWith('/tenants', tenantData);
      expect(result).toEqual(response.data);
    });

    it('updateTenant should put updated tenant data', async () => {
      const tenantData = {
        tenantName: 'Updated Tenant',
        tenantCode: 'UPDATED'
      };
      const response = { data: { id: 1, ...tenantData } };

      axios.put.mockResolvedValue(response);

      const result = await api.updateTenant(1, tenantData);

      expect(axios.put).toHaveBeenCalledWith('/tenants/1', tenantData);
      expect(result).toEqual(response.data);
    });

    it('deleteTenant should delete tenant', async () => {
      axios.delete.mockResolvedValue({ data: {} });

      await api.deleteTenant(1);

      expect(axios.delete).toHaveBeenCalledWith('/tenants/1');
    });
  });

  describe('Client API', () => {
    it('getClients should fetch all clients', async () => {
      const clients = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' }
      ];
      axios.get.mockResolvedValue({ data: clients });

      const result = await api.getClients();

      expect(axios.get).toHaveBeenCalledWith('/clients');
      expect(result).toEqual(clients);
    });

    it('getClientById should fetch single client', async () => {
      const client = { id: 1, firstName: 'John', lastName: 'Doe' };
      axios.get.mockResolvedValue({ data: client });

      const result = await api.getClientById(1);

      expect(axios.get).toHaveBeenCalledWith('/clients/1');
      expect(result).toEqual(client);
    });

    it('createClient should post client data', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phoneNumber: '+27123456789'
      };
      const response = { data: { id: 1, ...clientData } };

      axios.post.mockResolvedValue(response);

      const result = await api.createClient(clientData);

      expect(axios.post).toHaveBeenCalledWith('/clients', clientData);
      expect(result).toEqual(response.data);
    });

    it('updateClient should put updated client data', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe Updated'
      };
      const response = { data: { id: 1, ...clientData } };

      axios.put.mockResolvedValue(response);

      const result = await api.updateClient(1, clientData);

      expect(axios.put).toHaveBeenCalledWith('/clients/1', clientData);
      expect(result).toEqual(response.data);
    });

    it('deleteClient should delete client', async () => {
      axios.delete.mockResolvedValue({ data: {} });

      await api.deleteClient(1);

      expect(axios.delete).toHaveBeenCalledWith('/clients/1');
    });

    it('getClientsByTenant should fetch clients for specific tenant', async () => {
      const clients = [
        { id: 1, tenantId: 1, firstName: 'John' }
      ];
      axios.get.mockResolvedValue({ data: clients });

      const result = await api.getClientsByTenant(1);

      expect(axios.get).toHaveBeenCalledWith('/clients/tenant/1');
      expect(result).toEqual(clients);
    });

    it('searchClients should search with keyword', async () => {
      const clients = [{ id: 1, firstName: 'John' }];
      axios.get.mockResolvedValue({ data: clients });

      const result = await api.searchClients('John');

      expect(axios.get).toHaveBeenCalledWith('/clients/search', {
        params: { keyword: 'John' }
      });
      expect(result).toEqual(clients);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        }
      };

      axios.get.mockRejectedValue(error);

      await expect(api.getTenants()).rejects.toEqual(error);
    });

    it('handles network errors', async () => {
      const error = new Error('Network Error');
      axios.get.mockRejectedValue(error);

      await expect(api.getClients()).rejects.toThrow('Network Error');
    });
  });
});
