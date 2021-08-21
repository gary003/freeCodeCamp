const palindrome = (str) => {
  return (
    str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ==
    str
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .split("")
      .reverse()
      .join("")
  )
}

palindrome("eye")
