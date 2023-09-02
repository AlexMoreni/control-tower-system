const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

class newAirways {
  constructor(id, origin, destiny, size) {
    this.id = id;
    this.origin = origin;
    this.destiny = destiny;
    this.size = parseInt(size);
  }
}

class newPilot {
  constructor(registration, name, qualification) {
    this.registration = registration;
    this.name = name;
    this.qualification = qualification;
  }
}

class newAircraft {
  constructor(prefix, type, cruisingSpeed, autonomy, maintenance) {
    this.prefix = prefix;
    this.type = type;
    this.cruisingSpeed = parseInt(cruisingSpeed);
    this.autonomy = parseInt(autonomy);
    this.maintenance = maintenance;
  }
}

class newAircraftCommercial extends newAircraft {
  constructor(
    prefix,
    type,
    cruisingSpeed,
    autonomy,
    cia,
    weightMax,
    passagersMax
  ) {
    super(prefix, type, cruisingSpeed, autonomy);
    this.cia = cia;
    this.weightMax = parseInt(weightMax);
    this.passagersMax = parseInt(passagersMax);
  }
}

class newFightPlan {
  constructor(
    pilotEnrollment,
    pilotPrefix,
    date,
    hour,
    idAirways,
    altitude,
    slot
  ) {
    this.id = Math.round(Math.random() * 1000);
    this.pilotEnrollment = pilotEnrollment;
    this.pilotPrefix = pilotPrefix;
    this.date = date;
    this.hour = hour;
    this.idAirways = idAirways;
    this.altitude = parseInt(altitude);
    this.slot = slot;
    this.canceled = false;
  }
}

commandTower();

function commandTower() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actions",
        message: "O que você deseja fazer?",
        choices: [
          "Listar aerovias",
          "Listar aeronaves",
          "Serviço pilotos",
          "Listar altitudes livre",
          "Aprovar plano de voo",
          "Listar planos de voo",
          "Cancelar plano de voo",
          "Listar ocupação",
          "Sair",
        ],
      },
    ])
    .then((answers) => {
      const options = answers["actions"];

      if (options === "Listar aerovias") {
        listAirways();
      } else if (options === "Listar aeronaves") {
        listAircraft();
      } else if (options === "Serviço pilotos") {
        pilotService();
      } else if (options === "Listar altitudes livre") {
        listFreeAltitudes();
      } else if (options === "Aprovar plano de voo") {
        approveFlightPlan();
      } else if (options === "Listar planos de voo") {
        listFlightPlan();
      } else if (options === "Cancelar plano de voo") {
        deleteFlightPlan();
      } else if (options === "Listar ocupação") {
        airwayOccupation();
      } else if (options === "Sair") {
        console.log(chalk.bgGreen.black("Sistema finalizado!"));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

//Opcão - Listar aerovias
const listAirways = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actionsListAirways",
        message: "O que você deseja fazer?",
        choices: ["Listar aerovias", "Criar aerovia", "Voltar"],
      },
    ])
    .then((answers) => {
      const options = answers["actionsListAirways"];

      if (options === "Criar aerovia") {
        inquirer
          .prompt([
            {
              name: "NameAirways",
              message: "Qual o ID da aerovia?:",
            },
            {
              name: "Origin",
              message: "Qual a origem:",
            },
            {
              name: "Destiny",
              message: "Qual o destino:",
            },
            {
              name: "Size",
              message: "Qual o tamanho:",
            },
          ])
          .then((answers) => {
            const id = answers["NameAirways"];
            const origin = answers["Origin"];
            const destiny = answers["Destiny"];
            const size = answers["Size"];

            const arrEstados = [
              "AC",
              "AL",
              "AP",
              "AM",
              "BA",
              "CE",
              "DF",
              "ES",
              "GO",
              "MA",
              "MT",
              "MS",
              "MG",
              "PA",
              "PB",
              "PR",
              "PE",
              "PI",
              "RJ",
              "RN",
              "RS",
              "RO",
              "RR",
              "SC",
              "SP",
              "SE",
              "TO",
            ];
            var regex = /[a-zA-Z]/;

            if (id.length < 4) {
              console.log(
                chalk.bgRed.black("Insira um nome maior que 4 letras")
              );
              listAirways();
              return;
            }

            if (!arrEstados.includes(origin)) {
              console.log(
                chalk.bgRed.black("Insira um estado válido para a origem!")
              );
              console.log(chalk.bgGray.white(`Formato: ${arrEstados[3]}`));
              listAirways();
              return;
            }

            if (!arrEstados.includes(destiny)) {
              console.log(
                chalk.bgRed.black("Insira um estado válido para o destino!")
              );
              console.log(chalk.bgGray.white(`Formato: ${arrEstados[2]}`));
              listAirways();
              return;
            }

            if (regex.test(size)) {
              console.log(
                chalk.bgRed.black(
                  "O tamanho não pode conter letras, apenas números!"
                )
              );
              listAirways();
              return;
            }

            const airways = new newAirways(id, origin, destiny, size);

            if (!fs.existsSync("airways")) {
              fs.mkdirSync("airways");
            }

            if (fs.existsSync(`airways/${airways.id}.json`)) {
              console.log(
                chalk.bgRed.black("Essa aerovia ja existe, escolha outro nome!")
              );
              listAirways();
              return;
            }

            const airwaysJSON = JSON.stringify(airways, null, 2);

            fs.writeFileSync(
              `airways/${airways.id}.json`,
              airwaysJSON,
              (err) => {
                console.log(err);
              }
            );

            console.log(chalk.bgGreen.black("Aerovia criada com sucesso!"));
            listAirways();
            return;
          })
          .catch((err) => console.log(err));
      } else if (options === "Listar aerovias") {
        if (!fs.existsSync("airways")) {
          console.log(chalk.bgRed.black("Nenhuma aerovia criada!"));
          listAirways();
          return;
        }

        inquirer
          .prompt([
            {
              name: "nameAirways",
              message: "Digite o ID da aerovia que deseja buscar:",
            },
          ])
          .then((answers) => {
            const name = answers["nameAirways"];

            if (!fs.existsSync(`airways/${name}.json`)) {
              console.log(chalk.bgRed.black("Aerovia não encontrada!"));
              listAirways();
            }

            if (fs.existsSync(`airways/${name}.json`)) {
              fs.readFile(`airways/${name}.json`, "utf8", (err, data) => {
                if (err) {
                  console.log(err);
                  return;
                }

                try {
                  const jsonData = JSON.parse(data);
                  const formattedData = JSON.stringify(jsonData, null, 2);
                  console.log(`Aerovia encontrada:\n${formattedData}`);
                  listAirways();
                } catch (parseError) {
                  console.log("Erro em converter para string!", parseError);
                  return;
                }
              });
            }
          })
          .catch((err) => console.log(err));
      } else if (options === "Voltar") {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};

/*Opção - Listar aeronaves */
const listAircraft = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actionsListAircraft",
        message: "O que você deseja fazer?",
        choices: ["Listar aeronaves", "Registrar nova aeronave", "Voltar"],
      },
    ])
    .then((answers) => {
      const option = answers["actionsListAircraft"];

      if (option === "Listar aeronaves") {
        if (!fs.existsSync("aircrafts")) {
          console.log(
            chalk.bgRed.black("Nenhuma aeronave cadastrada no sistema!")
          );
          listAircraft();
          return;
        }

        inquirer
          .prompt([
            {
              type: "list",
              name: "optionListAircraft",
              message: "Qual tipo você deseja listar?",
              choices: ["Particular", "Comercial"],
            },
          ])
          .then((answers) => {
            const option = answers["optionListAircraft"];

            let directoryPath = "aircrafts";
            let filesProcessed = 0;

            if (!fs.existsSync(directoryPath)) {
              console.log(
                chalk.bgRed.black("Nenhuma aeronave cadastrada no sistema!")
              );
              listAircraft();
              return;
            }

            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.error("Erro ao ler o diretório:", err);
                return;
              }

              const jsonFiles = files.filter(
                (file) => path.extname(file).toLowerCase() === ".json"
              );

              jsonFiles.forEach((jsonFile) => {
                const filePath = path.join(directoryPath, jsonFile);

                fs.readFile(filePath, "utf8", (err, data) => {
                  if (err) {
                    console.error("Erro ao ler o arquivo:", err);
                    return;
                  }

                  const jsonData = JSON.parse(data);

                  if (jsonData.type === option) {
                    console.log(
                      `Aeronave -  ${jsonFile.replace(".json", "")}:`,
                      jsonData
                    );
                  }
                  filesProcessed++;

                  if (filesProcessed === jsonFiles.length) {
                    listAircraft();
                  }
                });
              });
            });
          })
          .catch((err) => console.log(err));
      } else if (option === "Registrar nova aeronave") {
        inquirer
          .prompt([
            {
              name: "Prefix",
              message: "Prefixo da aeronave:",
            },
            {
              name: "Type",
              message: "Tipo da aeronave - Particular/Comercial?:",
            },
            {
              name: "CruisingSpeed",
              message: "Velocidade de Cruzeiro:",
            },
            {
              name: "Autonomy",
              message: "Autonomia:",
            },
          ])
          .then((answers) => {
            const prefix = answers["Prefix"];
            const type = answers["Type"];
            const cruisingSpeed = answers["CruisingSpeed"];
            const autonomy = answers["Autonomy"];

            function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            }

            const preventType = type.toLowerCase(type);
            const typeFormated = capitalizeFirstLetter(preventType);

            if (typeFormated === "Particular") {
              inquirer
                .prompt([
                  {
                    name: "Maintenance",
                    message: "Manutenção:",
                  },
                ])
                .then((answers) => {
                  const maintenance = answers["Maintenance"];

                  var regex = /[a-zA-Z]/;

                  if (regex.test(cruisingSpeed)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para velocidade de cruzeiro, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  if (regex.test(autonomy)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para autonomia, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  if (maintenance.length < 3) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão incorreto para manuntenção, insira ao menos 3 letras"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  const aircraft = new newAircraft(
                    prefix,
                    typeFormated,
                    cruisingSpeed,
                    autonomy,
                    maintenance
                  );

                  if (!fs.existsSync("aircrafts")) {
                    fs.mkdirSync("aircrafts");
                  }

                  if (fs.existsSync(`aircrafts/${aircraft.prefix}.json`)) {
                    console.log(
                      chalk.bgRed.black(
                        "Essa aeronave ja está cadastrada no sistema!"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  const aircraftJSON = JSON.stringify(aircraft, null, 2);

                  fs.writeFileSync(
                    `aircrafts/${aircraft.prefix}.json`,
                    aircraftJSON,
                    (err) => {
                      console.log(err);
                    }
                  );

                  console.log(
                    chalk.bgGreen.black("Aeronave cadastrada no sistema!")
                  );
                  listAircraft();
                  return;
                })
                .catch((err) => console.log(err));
            } else if (typeFormated === "Comercial") {
              inquirer
                .prompt([
                  {
                    name: "NameCIA",
                    message: "Nome CIA:",
                  },
                  {
                    name: "WeightMax",
                    message: "Peso Máximo:",
                  },
                  { name: "PassengersMax", message: "Passageiros Máximo:" },
                ])
                .then((answers) => {
                  const cia = answers["NameCIA"];
                  const weightMax = answers["WeightMax"];
                  const passagersMax = answers["PassengersMax"];

                  var regex = /[a-zA-Z]/;

                  if (regex.test(cruisingSpeed)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para velocidade de cruzeiro, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  if (regex.test(autonomy)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para autonomia, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  if (cia.length < 3) {
                    console.log(
                      chalk.bgRed.black(
                        "Nome curto para CIA, insira ao menos 3 letras"
                      )
                    );
                  }

                  if (regex.test(weightMax)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para peso, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  if (regex.test(passagersMax)) {
                    console.log(
                      chalk.bgRed.black(
                        "Padrão não permitido para quantidade de passageiros, digite apenas números"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  const aircraft = new newAircraftCommercial(
                    prefix,
                    typeFormated,
                    cruisingSpeed,
                    autonomy,
                    cia,
                    weightMax,
                    passagersMax
                  );

                  if (!fs.existsSync("aircrafts")) {
                    fs.mkdirSync("aircrafts");
                  }

                  if (fs.existsSync(`aircrafts/${aircraft.prefix}.json`)) {
                    console.log(
                      chalk.bgRed.black(
                        "Essa aeronave ja está cadastrada no sistema!"
                      )
                    );
                    listAircraft();
                    return;
                  }

                  const aircraftJSON = JSON.stringify(aircraft, null, 2);

                  fs.writeFileSync(
                    `aircrafts/${aircraft.prefix}.json`,
                    aircraftJSON,
                    (err) => {
                      console.log(err);
                    }
                  );

                  console.log(
                    chalk.bgGreen.black("Aeronave cadastrada no sistema!")
                  );
                  listAircraft();
                  return;
                })
                .catch((err) => console.log(err));
            } else {
              console.log(
                chalk.bgRed.black(
                  "Tipo não permitido apenas particular/comercial"
                )
              );
              listAircraft();
              return;
            }
          })
          .catch((err) => console.log(err));
      } else if (option === "Voltar") {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};

/*Opcão - Serviço Pilotos */
const pilotService = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actionsPilotServices",
        message: "O que você deseja fazer?",
        choices: ["Cadastrar piloto", "Pilotos", "Buscar piloto", "Voltar"],
      },
    ])
    .then((answers) => {
      const option = answers["actionsPilotServices"];

      if (option === "Cadastrar piloto") {
        inquirer
          .prompt([
            {
              name: "Registration",
              message: "Matricula do piloto:",
            },
            {
              name: "Name",
              message: "Nome do piloto:",
            },
            {
              name: "Qualification",
              message: "Habilitação do piloto:",
            },
          ])
          .then((answers) => {
            const registration = answers["Registration"];
            const name = answers["Name"];
            let qualification = answers["Qualification"];

            if (registration.length < 3) {
              console.log(
                chalk.bgRed.black(
                  "Matricula inválida, insira uma matricula igual o maior que 3 letras"
                )
              );
              pilotService();
              return;
            }

            if (name.length < 3) {
              console.log(
                chalk.bgRed.black(
                  "Nome inválido, insira um nome igual o maior que 3 letras"
                )
              );
              pilotService();
              return;
            }

            const qualificationFormated = qualification.toLowerCase();

            if (
              qualificationFormated !== "valido" &&
              qualificationFormated !== "invalido"
            ) {
              console.log(
                chalk.bgRed.black(
                  "Por favor, digite apenas: Valido ou Invalido para habilitação do piloto"
                )
              );
              pilotService();
              return;
            }

            if (qualificationFormated === "valido") {
              qualification = true;
            } else {
              qualification = false;
            }

            const pilot = new newPilot(registration, name, qualification);

            if (!fs.existsSync("pilots")) {
              fs.mkdirSync("pilots");
            }

            if (fs.existsSync(`pilots/${pilot.registration}.json`)) {
              console.log(chalk.bgRed.black("Esse piloto já está cadastrado!"));
              pilotService();
              return;
            }

            const pilotJSON = JSON.stringify(pilot, null, 2);

            fs.writeFileSync(
              `pilots/${pilot.registration}.json`,
              pilotJSON,
              (err) => {
                console.log(err);
              }
            );

            console.log(chalk.bgGreen.black("Piloto cadastrado com sucesso!"));
            pilotService();
            return;
          })
          .catch((err) => console.log(err));
      } else if (option === "Pilotos") {
        if (!fs.existsSync("pilots")) {
          console.log(
            chalk.bgRed.black("Nenhum piloto cadastrado no sistema!")
          );
          pilotService();
          return;
        }

        const directoryPath = "./pilots";

        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error("Erro ao ler o diretório:", err);
            return;
          }

          const jsonFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".json"
          );

          let filesProcessed = 0;
          jsonFiles.forEach((jsonFile) => {
            const filePath = path.join(directoryPath, jsonFile);

            fs.readFile(filePath, "utf8", (err, data) => {
              if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return;
              }

              const jsonData = JSON.parse(data);

              console.log(`Piloto ${jsonFile.replace(".json", "")}:`, jsonData);
              filesProcessed++;

              if (filesProcessed === jsonFiles.length) {
                pilotService();
              }
            });
          });
        });
      } else if (option === "Buscar piloto") {
        if (!fs.existsSync("pilots")) {
          console.log(
            chalk.bgRed.black("Nenhum piloto cadastrado no sistema!")
          );
          pilotService();
          return;
        }

        inquirer
          .prompt([
            {
              name: "NamePilot",
              message: "Qual a matricula do piloto que deseja localizar?",
            },
          ])
          .then((answers) => {
            const namePilot = answers["NamePilot"];

            if (!fs.existsSync(`pilots/${namePilot}.json`)) {
              console.log(chalk.bgRed.black("Piloto não encontrado!"));
              pilotService();
            }

            if (fs.existsSync(`pilots/${namePilot}.json`)) {
              fs.readFile(`pilots/${namePilot}.json`, "utf8", (err, data) => {
                if (err) {
                  console.log(err);
                  return;
                }

                try {
                  const jsonData = JSON.parse(data);
                  const formattedData = JSON.stringify(jsonData, null, 2);
                  console.log(`Piloto encontrado:\n${formattedData}`);
                  listAirways();
                } catch (parseError) {
                  console.log("Erro em converter para string!", parseError);
                  return;
                }
              });
            }
          })
          .catch((err) => console.log(err));
      } else if (option === "Voltar") {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};

/*Opção - Listar altitudes Lives*/
const listFreeAltitudes = () => {
  if (!fs.existsSync("./fightPlan")) {
    console.log(chalk.bgRed.black("Nenhum plano cadastrado no sistema!"));
    commandTower();
    return;
  }

  const directoryPath = "fightPlan";
  const occupiedAltitudes = [];

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Erro ao ler o diretório:", err);
      return;
    }

    const jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );

    console.log(chalk.bgGreen.black("Altitudes Livres!"));
    let filesProcessed = 0;

    jsonFiles.forEach((jsonFile) => {
      const filePath = path.join(directoryPath, jsonFile);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Erro ao ler o arquivo:", err);
          return;
        }

        const jsonData = JSON.parse(data);

        const allowedAltitudes = [
          25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000,
          35000,
        ];

        allowedAltitudes.forEach((item) => {
          if (jsonData.altitude === item) {
            occupiedAltitudes.push(jsonData.altitude);
          }
        });

        filesProcessed++;

        if (filesProcessed === jsonFiles.length) {
          const result = allowedAltitudes.filter(
            (element) => !occupiedAltitudes.includes(element)
          );
          console.log(`Altitudes livres: ${result}`);
          airwayOccupation();
        }
      });
    });
  });
};

/*Opção - Aprovar Plano de voo */
const approveFlightPlan = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "ApproveFlightPlan",
        message: "O que você deseja fazer?",
        choices: ["Aprovar um novo plano", "Voltar"],
      },
    ])
    .then((answers) => {
      const option = answers["ApproveFlightPlan"];

      if (option === "Aprovar um novo plano") {
        inquirer
          .prompt([
            {
              name: "PilotEnrollment",
              message: "Matricula do Piloto:",
            },
            {
              name: "PilotPrefix",
              message: "Prefixo da aeronave:",
            },
            {
              name: "Date",
              message: "Data:",
            },
            {
              name: "Hour",
              message: "Horário:",
            },
            {
              name: "IDAirways",
              message: "ID aerovia:",
            },
            {
              name: "Altitude",
              message: "Altitude:",
            },
          ])
          .then((answers) => {
            const pilotEnrollment = answers["PilotEnrollment"];
            const pilotPrefix = answers["PilotPrefix"];
            const date = answers["Date"];
            const hour = answers["Hour"];
            const idAirways = answers["IDAirways"];
            const altitude = answers["Altitude"];
            let sizeAirways;
            let velocity;
            let slots = 0;
            const regex = /[a-zA-Z]/;

            if (!fs.existsSync(`pilots/${pilotEnrollment}.json`)) {
              console.log(chalk.bgRed.black("Piloto não encontrado!"));
              approveFlightPlan();
              return;
            }

            if (fs.existsSync(`pilots/${pilotEnrollment}.json`)) {
              fs.readFile(
                `pilots/${pilotEnrollment}.json`,
                "utf8",
                (err, data) => {
                  if (err) {
                    console.log(err);
                    return;
                  }

                  try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.qualification === false) {
                      console.log(
                        chalk.bgRed.black("Piloto com licença invalida")
                      );
                      approveFlightPlan();
                      return;
                    }
                  } catch (parseError) {
                    console.log("Erro em converter para string!", parseError);
                    return;
                  }
                }
              );
            }

            if (!fs.existsSync(`aircrafts/${pilotPrefix}.json`)) {
              console.log(chalk.bgRed.black("Aeronave não encontrada!"));
              approveFlightPlan();
              return;
            }

            if (date.length < 10) {
              console.log(
                chalk.bgRed.black(
                  "Padrão não permitido para data digite apenas números e no formato: 00/00/0000"
                )
              );
              commandTower();
              return;
            }

            if (hour.length < 5) {
              console.log(
                chalk.bgRed.black(
                  "Padrão não permitido para hora digite apenas números e no formato: 00:00"
                )
              );
              commandTower();
              return;
            }

            if (!fs.existsSync(`airways/${idAirways}.json`)) {
              console.log(chalk.bgRed.black("Aerovia não encontrada!"));
              approveFlightPlan();
              return;
            }

            if (regex.test(altitude)) {
              console.log(
                chalk.bgRed.black(
                  "Padrão não permitido para altitude, digite apenas números"
                )
              );
              commandTower();
              return;
            }

            if (altitude < 25000 || altitude > 35000) {
              console.log(
                chalk.bgRed.black(
                  "Altura não permitida para altitude, fique entre 25000 a 35000"
                )
              );
              commandTower();
              return;
            }

            try {
              const aircraftData = fs.readFileSync(
                `aircrafts/${pilotPrefix}.json`,
                "utf8"
              );
              const aircraftJsonData = JSON.parse(aircraftData);
              velocity = aircraftJsonData.cruisingSpeed;
            } catch (err) {
              console.log(
                "Erro ao ler ou analisar o arquivo de aeronave:",
                err
              );
            }

            try {
              const airwaysData = fs.readFileSync(
                `airways/${idAirways}.json`,
                "utf8"
              );
              const airwaysJsonData = JSON.parse(airwaysData);
              sizeAirways = airwaysJsonData.size;
            } catch (err) {
              console.log("Erro ao ler ou analisar o arquivo de airways:", err);
            }

            const timeHour = sizeAirways / velocity;
            const timeMin = timeHour * 60;

            const hourStart = hour.split(":");

            const resultHour = timeMin - 60;

            if (resultHour + parseInt(hourStart[1]) > 60) {
              slots = Math.ceil(timeMin / 60 + 1);
            } else {
              slots = Math.ceil(timeMin / 60);
            }

            const fightPlan = new newFightPlan(
              pilotEnrollment,
              pilotPrefix,
              date,
              hour,
              idAirways,
              altitude,
              slots
            );

            if (!fs.existsSync("fightPlan")) {
              fs.mkdirSync("fightPlan");
            }

            if (fs.existsSync(`fightPlan/${fightPlan.id}.json`)) {
              console.log(chalk.bgRed.black("Esse plano de voo ja existe!"));
              approveFlightPlan();
              return;
            }

            const fightPlanJSON = JSON.stringify(fightPlan, null, 2);

            fs.writeFileSync(
              `fightPlan/${fightPlan.id}.json`,
              fightPlanJSON,
              (err) => {
                console.log(err);
              }
            );

            console.log(
              chalk.bgGreen.black("Plano de voo criado com sucesso!")
            );
            approveFlightPlan();
            return;
          })
          .catch((err) => console.log(err));
      } else if (option === "Voltar") {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};

/*Opção - Listar planos de voo*/
const listFlightPlan = () => {
  if (!fs.existsSync("./fightPlan")) {
    console.log(chalk.bgRed.black("Nenhum plano cadastrado no sistema!"));
    commandTower();
    return;
  }

  const directoryPath = "fightPlan";

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Erro ao ler o diretório:", err);
      return;
    }

    const jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );

    console.log(
      chalk.bgGreen.black(`${jsonFiles.length} Plano de voos encontrados:`)
    );
    let filesProcessed = 0;

    jsonFiles.forEach((jsonFile) => {
      const filePath = path.join(directoryPath, jsonFile);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Erro ao ler o arquivo:", err);
          return;
        }

        const jsonData = JSON.parse(data);

        console.log(`Plano -  ${jsonFile.replace(".json", "")}:`, jsonData);
        filesProcessed++;
        if (filesProcessed === jsonFiles.length) {
          commandTower();
        }
      });
    });
  });
};

/*Opção - Apagar planos de voo*/
const deleteFlightPlan = () => {
  if (!fs.existsSync("./fightPlan")) {
    console.log(
      chalk.bgRed.black("Nenhum plano para ser deletado/cancelado no sistema!")
    );
    commandTower();
    return;
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "DeleteFlightPlan",
        message: "O que você deseja fazer?",
        choices: ["Cancelar plano de voo", "Voltar"],
      },
    ])
    .then((answers) => {
      const option = answers["DeleteFlightPlan"];

      if (option === "Cancelar plano de voo") {
        inquirer
          .prompt([
            {
              name: "ID",
              message: "Qual ID do plano:",
            },
          ])
          .then((answers) => {
            const plan = answers["ID"];

            if (!fs.existsSync(`fightPlan/${plan}.json`)) {
              console.log(chalk.bgRed.black("Plano não encontrado"));
              commandTower();
              return;
            }

            fs.unlinkSync(`fightPlan/${plan}.json`, (err) => {
              if (err) {
                console.log("Erro", err);
              }
            });

            console.log(
              chalk.bgGreen.black("Plano de voo apagado com sucesso!")
            );

            commandTower();
            return;
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

/*Opção - Ocupação aerovia */
const airwayOccupation = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "airwayOccupation",
        message: "O que você deseja fazer?",
        choices: [
          "Verificar slots ocupados",
          "Altitudes ocupadas",
          "Liberar slots",
          "Ocupar slots",
          "Consultar slot ocupado",
          "Voltar",
        ],
      },
    ])
    .then((answers) => {
      const option = answers["airwayOccupation"];

      if (option === "Verificar slots ocupados") {
        if (!fs.existsSync("fightPlan")) {
          console.log(
            chalk.bgRed.black("Nenhum plano de voo cadastrado no sistema!")
          );
          airwayOccupation();
          return;
        }
        const directoryPath = "fightPlan";

        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error("Erro ao ler o diretório:", err);
            return;
          }

          const jsonFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".json"
          );

          let filesProcessed = 0;
          console.log(chalk.bgRed.black("Slots Ocupados!"));
          jsonFiles.forEach((jsonFile) => {
            const filePath = path.join(directoryPath, jsonFile);

            fs.readFile(filePath, "utf8", (err, data) => {
              if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return;
              }

              const jsonData = JSON.parse(data);

              if (jsonData.slot != 0) {
                console.log(
                  `Plano ${jsonFile.replace(".json", "")}: ID aerovia: ${
                    jsonData.id
                  } - Altitude: ${jsonData.altitude} - Slots: ${jsonData.slot}`
                );
              }

              filesProcessed++;

              if (filesProcessed === jsonFiles.length) {
                airwayOccupation();
              }
            });
          });
        });
      } else if (option === "Altitudes ocupadas") {
        if (!fs.existsSync("fightPlan")) {
          console.log(
            chalk.bgRed.black("Nenhum plano de voo cadastrado no sistema!")
          );
          airwayOccupation();
          return;
        }

        const directoryPath = "fightPlan";

        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error("Erro ao ler o diretório:", err);
            return;
          }

          const jsonFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".json"
          );

          console.log(chalk.bgRed.black("Altitudes Ocupadas!"));
          let filesProcessed = 0;

          jsonFiles.forEach((jsonFile) => {
            const filePath = path.join(directoryPath, jsonFile);

            fs.readFile(filePath, "utf8", (err, data) => {
              if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return;
              }

              const jsonData = JSON.parse(data);

              console.log(
                `Plano ${jsonFile.replace(
                  ".json",
                  ""
                )}: está ocupando a aeorvia: ${jsonData.idAirways} - Data: ${
                  jsonData.date
                } - Altitude: ${jsonData.altitude}`
              );

              filesProcessed++;

              if (filesProcessed === jsonFiles.length) {
                airwayOccupation();
              }
            });
          });
        });
      } else if (option === "Liberar slots") {
        if (!fs.existsSync("fightPlan")) {
          console.log(
            chalk.bgRed.black("Nenhum plano de voo cadastrado no sistema!")
          );
          airwayOccupation();
          return;
        }

        inquirer
          .prompt([
            {
              name: "LiberalSlots",
              message: "Qual plano deseja liberar?",
            },
          ])
          .then((answers) => {
            const slots = answers["LiberalSlots"];

            const directoryPath = "fightPlan";

            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.error("Erro ao ler o diretório:", err);
                return;
              }

              const jsonFiles = files.filter(
                (file) => path.extname(file).toLowerCase() === ".json"
              );

              jsonFiles.forEach((jsonFile) => {
                const filePath = path.join(directoryPath, jsonFile);

                fs.readFile(filePath, "utf8", (err, data) => {
                  if (err) {
                    console.error("Erro ao ler o arquivo:", err);
                    return;
                  }

                  const jsonData = JSON.parse(data);

                  if (parseInt(slots) === jsonData.id) {
                    jsonData.slot = 0;
                    const updatedData = JSON.stringify(jsonData, null, 2);

                    fs.writeFileSync(filePath, updatedData, "utf8", (err) => {
                      if (err) {
                        return;
                      }
                    });
                  }
                });
              });
            });
            console.log(chalk.bgGreen.black("Slot atualizado com sucesso!"));
            airwayOccupation();
          })
          .catch((err) => console.log(err));
      } else if (option === "Ocupar slots") {
        if (!fs.existsSync("fightPlan")) {
          console.log(
            chalk.bgRed.black("Nenhum plano de voo cadastrado no sistema!")
          );
          airwayOccupation();
          return;
        }

        inquirer
          .prompt([
            {
              name: "OccupySlots",
              message: "Qual plano de voo deseja inserir slot?",
            },
          ])
          .then((answers) => {
            const plan = answers["OccupySlots"];

            if (!fs.existsSync(`fightPlan/${plan}.json`)) {
              console.log(chalk.bgRed.black("Plano não encontrado!"));
              airwayOccupation();
              return;
            }

            fs.readFile(`fightPlan/${plan}.json`, "utf8", (err, data) => {
              let velocity = 0;
              let sizeAirways = 0;

              if (err) {
                console.log(err);
                return;
              }

              try {
                const jsonData = JSON.parse(data);

                //Velocidade aeronave
                try {
                  const aircraftData = fs.readFileSync(
                    `aircrafts/${jsonData.pilotPrefix}.json`,
                    "utf8"
                  );
                  const aircraftJsonData = JSON.parse(aircraftData);
                  velocity = aircraftJsonData.cruisingSpeed;
                } catch (err) {
                  console.log(
                    "Erro ao ler ou analisar o arquivo de aeronave:",
                    err
                  );
                }

                //Tamanho da pista
                try {
                  const airwaysData = fs.readFileSync(
                    `airways/${jsonData.idAirways}.json`,
                    "utf8"
                  );
                  const airwaysJsonData = JSON.parse(airwaysData);
                  sizeAirways = airwaysJsonData.size;
                } catch (err) {
                  console.log(
                    "Erro ao ler ou analisar o arquivo de airways:",
                    err
                  );
                }

                let slots = 0;

                const hourStart = jsonData.hour;

                const timeHour = sizeAirways / velocity;
                const timeMin = timeHour * 60;

                const hourStartMinutes = hourStart.split(":");

                const resultHour = timeMin - 60;

                if (resultHour + parseInt(hourStartMinutes[1]) > 60) {
                  slots = Math.ceil(timeMin / 60 + 1);
                } else {
                  slots = Math.ceil(timeMin / 60);
                }

                jsonData.slot = slots;
                const updatedData = JSON.stringify(jsonData, null, 2);

                const hourStartFormated = hourStart.split(":");

                function timeInterval(inicial, quantidade) {
                  for (let i = 0; i < quantidade; i++) {
                    console.log(
                      chalk.bgGreen.black(
                        `O plano irá ocupar ${inicial + i}:00 horas`
                      )
                    );
                  }
                }

                console.log(
                  chalk.bgGreen.black(`O plano irá ocupar ${slots} slots`)
                );
                timeInterval(parseInt(hourStartFormated[0]), slots);

                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "ConfirmInsert",
                      message: "Deseja realmente inserir?",
                      choices: ["Confirmar", "Cancelar"],
                    },
                  ])
                  .then((answers) => {
                    const option = answers["ConfirmInsert"];

                    if (option === "Confirmar") {
                      fs.writeFileSync(
                        `fightPlan/${plan}.json`,
                        updatedData,
                        "utf8",
                        (err) => {
                          if (err) {
                            return;
                          }
                        }
                      );

                      console.log(
                        chalk.bgGreen.black(
                          `Slot inserido com sucesso no plano ${plan}`
                        )
                      );
                      airwayOccupation();
                    } else if (option === "Cancelar") {
                      console.log(chalk.bgRed.black("Ok, cancelando"));
                      airwayOccupation();
                      return;
                    }
                  })
                  .catch((err) => console.log(err));
              } catch (parseError) {
                console.log("Erro em converter para string!", parseError);
                return;
              }
            });
          })
          .catch((err) => console.log(err));
      } else if (option === "Consultar slot ocupado") {
        if (!fs.existsSync("fightPlan")) {
          console.log(
            chalk.bgRed.black("Nenhum plano de voo cadastrado no sistema!")
          );
          airwayOccupation();
          return;
        }

        inquirer
          .prompt([
            {
              name: "ConsultSlot",
              message: "Qual slot deseja consultar:",
            },
          ])
          .then((answers) => {
            const numberSlot = answers["ConsultSlot"];

            const directoryPath = "fightPlan";

            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.error("Erro ao ler o diretório:", err);
                return;
              }

              const jsonFiles = files.filter(
                (file) => path.extname(file).toLowerCase() === ".json"
              );

              let filesProcessed = 0;

              jsonFiles.forEach((jsonFile) => {
                const filePath = path.join(directoryPath, jsonFile);

                fs.readFile(filePath, "utf8", (err, data) => {
                  if (err) {
                    console.error("Erro ao ler o arquivo:", err);
                    return;
                  }

                  const jsonData = JSON.parse(data);

                  if (jsonData.slot === parseInt(numberSlot)) {
                    console.log(chalk.bgGreen.black("Slot Encontrado!"));
                    console.log(
                      `Plano ${jsonFile.replace(".json", "")}: ID aerovia: ${
                        jsonData.id
                      } Data: ${jsonData.date} - Altitude: ${
                        jsonData.altitude
                      } - Slots: ${jsonData.slot}`
                    );
                    airwayOccupation();
                    return;
                  }

                  filesProcessed++;

                  if (filesProcessed === jsonFiles.length) {
                    console.log(chalk.bgRed.black("Nenhum slot encontrado!"));
                    airwayOccupation();
                  }
                });
              });
            });
          })
          .catch((err) => console.log(err));
      } else if (option === "Voltar") {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};
