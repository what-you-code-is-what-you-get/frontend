import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LargeLogoComponent from '../LargeLogoComponent.vue'

describe('LargeLogoComponent.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(LargeLogoComponent)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the logo image with correct src and alt attributes', () => {
    const wrapper = mount(LargeLogoComponent)
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/src/assets/images/logo.svg')
    expect(img.attributes('alt')).toBe('WYCIWYG - What you code is what you get')
  })
})
