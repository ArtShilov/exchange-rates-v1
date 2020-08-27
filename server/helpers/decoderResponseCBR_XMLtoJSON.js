const fetch = require("node-fetch");
const convert = require("xml-js"); // parser xml to json
const iconv = require("iconv-lite"); // decoder

async function decoderResponseCBR_XMLtoJSON(request) {
  /* раскодирование win1251  */
  function cnw8(buf) {
    return iconv.decode(Buffer.from(buf, "binary"), "cp1251").toString();
  }
  /*  XML -> JSON  */
  function XMLtoJSON(xml) {
    return convert.xml2json(xml, { compact: true, spaces: 4 });
  }

  const result = await fetch(request)
    .then((res) => res.buffer())
    .then((buf) => cnw8(buf))
    .then((xml) => XMLtoJSON(xml))
    .catch((err) => console.error("\n--------------------\n\n\n", err));
  return result;
}

module.exports = { decoderResponseCBR_XMLtoJSON };
