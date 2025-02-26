import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ButtonComponent from '../ButtonComponent.vue'

describe('ButtonComponent.vue', () => {
  it('renders button with correct text', () => {
    const wrapper = mount(ButtonComponent, { props: { text: 'Click me', color: 'orange' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits event on button click', async () => {
    const wrapper = mount(ButtonComponent, { props: { text: 'Click me', color: 'orange' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('emitFunction')
  })

  it('applies correct class based on color prop', () => {
    const wrapper = mount(ButtonComponent, { props: { text: 'Click me', color: 'orange' } })
    expect(wrapper.find('button').classes()).toContain('orange')
  })

  it('renders button with different colors', () => {
    const colors = ['orange', 'green', 'blue']
    colors.forEach((color) => {
      const wrapper = mount(ButtonComponent, { props: { text: 'Button', color } })
      expect(wrapper.find('button').classes()).toContain(color)
    })
  })
})
