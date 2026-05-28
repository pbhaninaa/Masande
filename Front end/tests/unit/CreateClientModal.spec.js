import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CreateClientModal from '@/components/CreateClientModal.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CreateClientModal.vue', () => {
  let wrapper
  let dispatch

  const createValidationMock = (invalid = false) => ({
    $touch: jest.fn(),
    $invalid: invalid,
    formData: {
      name: { $error: false, $touch: jest.fn() },
      phoneNumber: { $error: false, $touch: jest.fn() },
      loanLimit: { $error: false },
      maxMonthlyCommitment: { $error: false }
    }
  })

  beforeEach(() => {
    dispatch = jest.fn().mockResolvedValue({})

    wrapper = shallowMount(CreateClientModal, {
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

  it('submits and dispatches client creation', async () => {
    jest.useFakeTimers()

    wrapper.setData({
      formData: {
        name: 'Kwazi',
        phoneNumber: '+27782141216',
        loanLimit: 5000,
        maxMonthlyCommitment: 500
      }
    })

    await wrapper.vm.handleSubmit()
    jest.runAllTimers()

    expect(dispatch).toHaveBeenCalledWith('clients/createClient', {
      name: 'Kwazi',
      phoneNumber: '+27782141216',
      loanLimit: 5000,
      maxMonthlyCommitment: 500
    })
    expect(wrapper.emitted().created).toBeTruthy()

    jest.useRealTimers()
  })

  it('does not dispatch when form is invalid', async () => {
    wrapper.vm.$v = createValidationMock(true)

    await wrapper.vm.handleSubmit()

    expect(dispatch).not.toHaveBeenCalled()
  })
})
