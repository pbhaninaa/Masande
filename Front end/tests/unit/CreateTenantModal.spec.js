import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CreateTenantModal from '@/components/CreateTenantModal.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CreateTenantModal.vue', () => {
  let wrapper
  let dispatch

  const createValidationMock = (invalid = false) => ({
    $touch: jest.fn(),
    $invalid: invalid,
    formData: {
      name: { $error: false, $touch: jest.fn() },
      code: { $error: false, $touch: jest.fn() },
      contactEmail: { $error: false, $touch: jest.fn() },
      adminEmail: { $error: false, $touch: jest.fn() },
      adminName: { $error: false, $touch: jest.fn() },
      adminPassword: { $error: false, $touch: jest.fn() }
    }
  })

  beforeEach(() => {
    dispatch = jest.fn().mockResolvedValue({})

    wrapper = shallowMount(CreateTenantModal, {
      localVue,
      mocks: {
        $store: { dispatch },
        $v: createValidationMock(false)
      },
      stubs: ['base-input', 'base-button']
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders modal content', () => {
    expect(wrapper.find('.modal').exists()).toBe(true)
  })

  it('submits and dispatches tenant creation', async () => {
    wrapper.setData({
      formData: {
        name: 'Acme Transport',
        code: 'ACME001',
        contactEmail: 'contact@acme.com',
        contactPhone: '+27110000000',
        adminEmail: 'admin@acme.com',
        adminName: 'Admin User',
        adminPhone: '+27119999999',
        adminPassword: 'admin123'
      }
    })

    await wrapper.vm.handleSubmit()

    expect(dispatch).toHaveBeenCalledWith('tenants/createTenant', {
      name: 'Acme Transport',
      code: 'ACME001',
      contactEmail: 'contact@acme.com',
      contactPhone: '+27110000000',
      adminEmail: 'admin@acme.com',
      adminName: 'Admin User',
      adminPhone: '+27119999999',
      adminPassword: 'admin123'
    })
    expect(wrapper.emitted().created).toBeTruthy()
  })

  it('does not dispatch when form is invalid', async () => {
    wrapper.vm.$v = createValidationMock(true)

    await wrapper.vm.handleSubmit()

    expect(dispatch).not.toHaveBeenCalled()
  })
})
