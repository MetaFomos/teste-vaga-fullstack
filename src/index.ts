import fs, { readSync } from "fs";
import { parse } from "csv-parse";
import Papa from "papaparse";
import { finished } from "stream/promises";
import { convertToBRL } from "./utils/converts";
import { generateCPF, validateCPF } from "./utils/validate";

/*********************** use case with papaparse  **************************/
const readCSV1 = () => {
  const csvFile = fs.readFileSync("data.csv", "utf8");
  const parsedData = Papa.parse(csvFile, {
    header: true,
    dynamicTyping: true
  });
  return parsedData;
};

const readCSV = async () => {
  const records: any[] = [];
  const parser = fs.createReadStream("data.csv").pipe(parse());

  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  const header = records.shift();
  const body = [...records];

  const data = [];
  for (let i = 0; i < body.length; i++) {
    const record = body[i];
    const _record: Record<string, string | number> = {};
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      _record[field] = record[j];
    }

    data.push(_record);
  }
  return data;
};

const updateData = async (data: Array<Record<string, string | number>>) => {
  const currencyHeaders = [
    "vlTotal",
    "vlPresta",
    "vlMora",
    "vlMulta",
    "vlOutAcr",
    "vlAtual"
  ];

  const _data: Array<Record<string, string | number | boolean>> = [];
  for (let i = 0; i < data.length; i++) {
    const record = data[i];

    const _record: Record<string, string | number | boolean> = {};
    for (let key in record) {
      _record[key] = record[key];
      if (currencyHeaders.indexOf(key) !== -1) {
        _record[`updated_${key}`] = convertToBRL(record[key]);
      }
    }

    /**************** validate & generate Cpf  ****************** */
    const isCpf = validateCPF(record["nrCpfCnpj"].toString());
    _record["isCpf"] = isCpf;

    if (!isCpf) {
      const _updatedCpf = generateCPF();
      _record["formated_nrCpfCnpj"] = _updatedCpf;
    }

    /**************** validate vltotal  ****************** */
    const isInstallment =
      (Number(record["vlTotal"]) / Number(record["qtPrestacoes"])).toFixed(
        2
      ) === Number(record["vlPresta"]).toFixed(2);

    _record["isInstallment"] = isInstallment;

    _data.push(_record);
  }

  console.log(_data, "--------- updated Data --------");
};

const init = async () => {
  const data = await readCSV();
  await updateData(data);
};

init();
