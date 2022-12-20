export const autofocus = (node, data) => {

  const focus = () => {
    setTimeout(() => node.focus(), 10)
  }

  return {
    update(newData) {
      focus()
    }
	}
}
