const telephoneCheck = (str) => {
  const validFormats = ["xxx-xxx-xxxx", "(xxx)xxx-xxxx", "(xxx) xxx-xxxx", "xxx xxx xxxx", "xxxxxxxxxx", "X_xxx-xxx-xxxx", "X_(xxx)xxx-xxxx", "X_(xxx) xxx-xxxx", "X_(xxx)xxx-xxxx", "X_(xxx) xxx-xxxx", "X_xxx xxx xxxx", "X_xxxxxxxxxx"]

  const cleanPhone = str
    .replace(/[^0-9 \-()]/, "")
    .replace(/^1 */, "X_")
    .replace(/[0-9]/g, "x")

  return validFormats.some((f) => f == cleanPhone)
}

telephoneCheck("555-555-5555")
