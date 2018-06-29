export const findNodeView = (id, flattening = []) => {
  const view = flattening.filter(c => c.id === id)[0]

  return {
    view,
    index: flattening.indexOf(view),
  }
}