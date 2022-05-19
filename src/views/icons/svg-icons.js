// const req = require.context('../../icons/svg', false, /\.svg$/)
const req = import.meta.globEager('../../icons/svg/*.svg')
const requireAll = (requireContext) => Object.keys(requireContext).map((key) => requireContext[key].default)

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map((i) => {
  return i.match(re)[1]
})

export default svgIcons
