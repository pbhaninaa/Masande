import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CreateTenantModal from '@/components/CreateTenantModal.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CreateTenantModal.vue', () => {
  let wrapper;
  let store;
  let actions;

  beforeEach(() => {
    actions = {
      createTenant: jest.fn()
    };

    store = new Vuex.Store({
      actions
    });

    wrapper = shallowMount(CreateTenantModal, {
      localVue,
      store,
      propsData: {
        visible: true
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders modal when visible prop is true', () => {
    expect(wrapper.find('.modal').exists()).toBe(true);
  });

  it('initializes with empty form data', () => {
    expect(wrapper.vm.formData.tenantName).toBe('');
    expect(wrapper.vm.formData.tenantCode).toBe('');
    expect(wrapper.vm.formData.adminEmail).toBe('');
    expect(wrapper.vm.formData.adminPassword).toBe('');
    expect(wrapper.vm.formData.adminFirstName).toBe('');
    expect(wrapper.vm.formData.adminLastName).toBe('');
  });

  it('validates required fields', async () => {
    // Try to submit empty form
    await wrapper.vm.handleSubmit();

    // Should have errors for required fields
    expect(wrapper.vm.errors.tenantName).toBeTruthy();
    expect(wrapper.vm.errors.tenantCode).toBeTruthy();
    expect(wrapper.vm.errors.adminEmail).toBeTruthy();
  });

  it('validates email format', async () => {
    wrapper.vm.formData.adminEmail = 'invalid-email';
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isValidEmail('invalid-email')).toBe(false);
    expect(wrapper.vm.isValidEmail('valid@email.com')).toBe(true);
  });

  it('validates tenant code format', () => {
    expect(wrapper.vm.isValidTenantCode('VALID_CODE')).toBe(true);
    expect(wrapper.vm.isValidTenantCode('invalid code')).toBe(false);
    expect(wrapper.vm.isValidTenantCode('invalid-code')).toBe(false);
  });

  it('submits form with valid data', async () => {
    wrapper.vm.formData = {
      tenantName: 'Test Tenant',
      tenantCode: 'TEST_TENANT',
      adminEmail: 'admin@test.com',
      adminPassword: 'TestPass123!',
      adminFirstName: 'John',
      adminLastName: 'Doe',
      contactEmail: 'contact@test.com',
      contactPhone: '+27123456789',
      address: '123 Test Street'
    };

    await wrapper.vm.handleSubmit();

    expect(actions.createTenant).toHaveBeenCalledWith(
      expect.any(Object),
      wrapper.vm.formData
    );
  });

  it('emits close event when cancel button is clicked', async () => {
    await wrapper.vm.close();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('clears form data when resetForm is called', () => {
    wrapper.vm.formData.tenantName = 'Test';
    wrapper.vm.errors.tenantName = 'Error';

    wrapper.vm.resetForm();

    expect(wrapper.vm.formData.tenantName).toBe('');
    expect(wrapper.vm.errors.tenantName).toBe('');
  });

  it('displays error messages for invalid input', async () => {
    wrapper.vm.formData.adminEmail = 'invalid';
    await wrapper.vm.validateField('adminEmail');

    expect(wrapper.vm.errors.adminEmail).toBeTruthy();
  });

  it('validates password strength', () => {
    expect(wrapper.vm.isValidPassword('weak')).toBe(false);
    expect(wrapper.vm.isValidPassword('StrongPass123!')).toBe(true);
  });
});
