import { shallowMount } from '@vue/test-utils'
import UserStats from '@/components/UserStats.vue'

describe('UserStats.vue', () => {
  it('it will not render .searchStats if "showResult" is false', () => {
    const showResult = false

    const wrapper = shallowMount(UserStats, {
      propsData: { showResult }
    })

    expect(wrapper.find('.searchStats').exists()).toBe(false)
  })

  it('it will initialize currentPage to 1', () => {
    const propsData = {
      showResult: true,
      search: {
        userCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    }

    const wrapper = shallowMount(UserStats, { propsData })

    expect(wrapper.vm.currentPage).toBe(1)
    expect(wrapper.vm.previousPageAvailable).toBe(false)
    expect(wrapper.vm.nextPageAvailable).toBe(false)
  })

  describe('Previous next pages', () => {
    it('if no user passed it will set previous/nextAvailablePage to false', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 0,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })

      expect(wrapper.vm.previousPageAvailable).toBe(false)
      expect(wrapper.vm.nextPageAvailable).toBe(false)
    })

    it('if hasNextPage is true it will set nextPageAvailable to true', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 1,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })

      expect(wrapper.vm.previousPageAvailable).toBe(false)
      expect(wrapper.vm.nextPageAvailable).toBe(true)
    })

    it('if currentPage is greater than 1 it will set previousPageAvailable to true', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: true
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.currentPage = 2

      expect(wrapper.vm.previousPageAvailable).toBe(true)
      expect(wrapper.vm.nextPageAvailable).toBe(false)
    })
  })

  describe('Total Pages', () => {
    it('if no user passed it will set total page to 0', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 0,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })

      expect(wrapper.vm.totalPages).toBe(0)
    })

    it('if no one user passed it will set total page to 1', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })

      expect(wrapper.vm.totalPages).toBe(1)
    })

    it('if no 11 user passed it will set total page to 2', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })

      expect(wrapper.vm.totalPages).toBe(2)
    })
  })

  describe('Methods', () => {
    it('NextPage method will change currentPage data', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.nextPage()

      expect(wrapper.vm.currentPage).toBe(2)
    })

    it('NextPage method will setCursors', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            endCursor: 'dummyCursor'
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.nextPage()

      expect(wrapper.vm.nextPageCursor).toBe('dummyCursor')
      expect(wrapper.vm.previousPageCursor).toBe(null)
    })

    it('NextPage method will emit PageEvent message with dummyCUrsor', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            endCursor: 'dummyCursor'
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.nextPage()

      expect(wrapper.emitted('PageEvent')[0][0]).toBe('nextPage')
      expect(wrapper.emitted('PageEvent')[0][1]).toBe('dummyCursor')
    })

    it('PreviousPage method will change currentPage data', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.currentPage = 2

      wrapper.vm.previousPage()

      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('PreviousPage method will setCursors', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'dummyCursor'
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.previousPage()

      expect(wrapper.vm.nextPageCursor).toBe(null)
      expect(wrapper.vm.previousPageCursor).toBe('dummyCursor')
    })

    it('PreviousPage method will emit PageEvent message with dummyCUrsor', () => {
      const propsData = {
        showResult: true,
        search: {
          userCount: 11,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'dummyCursor'
          }
        }
      }

      const wrapper = shallowMount(UserStats, { propsData })
      wrapper.vm.previousPage()

      expect(wrapper.emitted('PageEvent')[0][0]).toBe('previousPage')
      expect(wrapper.emitted('PageEvent')[0][1]).toBe('dummyCursor')
    })
  })
})
