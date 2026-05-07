import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import CreateClientModal from '@/components/CreateClientModal.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CreateClientModal.vue', () => {
  let wrapper;
  let store;
  let actions;
  let getters;

  beforeEach(() => {
    actions = {
      createClient: jest.fn()
    };

    getters = {
      currentTenantId: () => 1
    };

    store = new Vuex.Store({
      actions,
      getters
    });

    wrapper = shallowMount(CreateClientModal, {
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
    expect(wrapper.vm.formData.firstName).toBe('');
    expect(wrapper.vm.formData.lastName).toBe('');
    expect(wrapper.vm.formData.email).toBe('');
    expect(wrapper.vm.formData.phoneNumber).toBe('');
  });

  it('validates required fields', async () => {
    await wrapper.vm.handleSubmit();

    expect(wrapper.vm.errors.firstName).toBeTruthy();
    expect(wrapper.vm.errors.lastName).toBeTruthy();
    expect(wrapper.vm.errors.email).toBeTruthy();
    expect(wrapper.vm.errors.phoneNumber).toBeTruthy();
  });

  it('validates email format', () => {
    expect(wrapper.vm.isValidEmail('invalid-email')).toBe(false);
    expect(wrapper.vm.isValidEmail('valid@email.com')).toBe(true);
  });

  it('validates phone number format', () => {
    expect(wrapper.vm.isValidPhoneNumber('+27123456789')).toBe(true);
    expect(wrapper.vm.isValidPhoneNumber('invalid')).toBe(false);
  });

  it('submits form with valid data', async () => {
    wrapper.vm.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phoneNumber: '+27123456789',
      idNumber: '8505155123084',
      dateOfBirth: '1985-05-15',
      address: '123 Test Street',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+27987654321',
      notes: 'Test notes'
    };

    await wrapper.vm.handleSubmit();

    expect(actions.createClient).toHaveBeenCalled();
  });

  it('emits close event when cancel button is clicked', async () => {
    await wrapper.vm.close();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('clears form data when resetForm is called', () => {
    wrapper.vm.formData.firstName = 'Test';
    wrapper.vm.errors.firstName = 'Error';

    wrapper.vm.resetForm();

    expect(wrapper.vm.formData.firstName).toBe('');
    expect(wrapper.vm.errors.firstName).toBe('');
  });

  it('sets tenantId from store', () => {
    expect(wrapper.vm.formData.tenantId).toBe(1);
  });

  it('validates South African ID number format', () => {
    // Valid SA ID: 8505155123084
    expect(wrapper.vm.isValidSAIdNumber('8505155123084')).toBe(true);
    expect(wrapper.vm.isValidSAIdNumber('invalid')).toBe(false);
  });

  it('displays error messages for invalid input', async () => {
    wrapper.vm.formData.email = 'invalid';
    await wrapper.vm.validateField('email');

    expect(wrapper.vm.errors.email).toBeTruthy();
  });

  it('accepts optional fields as empty', async () => {
    wrapper.vm.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phoneNumber: '+27123456789'
      // Optional fields left empty
    };

    await wrapper.vm.handleSubmit();

    expect(actions.createClient).toHaveBeenCalled();
  });

  it('formats phone number with country code', () => {
    const formatted = wrapper.vm.formatPhoneNumber('0823456789');
    expect(formatted).toMatch(/^\+27/);
  });
});
