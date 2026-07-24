function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  // console.log(dataISO)
  return `${dia}/${mes}/${ano}`;
}
