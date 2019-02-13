import { shallowMount } from '@vue/test-utils'
import UserContainer from '@/components/UserContainer.vue'

describe('UserContainer.vue', () => {
  it('it will not render #userContainer if "showResult" is false', () => {
    const showResult = false

    const wrapper = shallowMount(UserContainer, {
      propsData: { showResult }
    })

    expect(wrapper.find('#userContainer').exists()).toBe(false)
  })

  it('it will render not #userContainer if "search" is empty object', () => {
    const propsData = {
      showResult: false,
      search: {}
    }

    const wrapper = shallowMount(UserContainer, { propsData })

    expect(wrapper.find('#userContainer').exists()).toBe(false)
  })

  it('it will render #userContainer if all prop are passed', () => {
    const propsData = {
      showResult: true,
      search: {
        nodes: [
        ]
      }
    }

    const wrapper = shallowMount(UserContainer, { propsData })

    expect(wrapper.find('#userContainer').exists()).toBe(true)
  })
})
