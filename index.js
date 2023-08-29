const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

class newAirways {
  constructor(name, origin, destiny, size) {
    this.id = Math.round(Math.random() * 1000);
    this.name = name;
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
    this.slot = parseInt([slot]);
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
        console.log("");
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
              name: "Name",
              message: "Nome da aerovia:",
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
            const name = answers["Name"];
            const origin = answers["Origin"];
            const destiny = answers["Destiny"];
            const size = answers["Size"];

            const airways = new newAirways(name, origin, destiny, size);

            if (!fs.existsSync("airways")) {
              fs.mkdirSync("airways");
            }

            if (fs.existsSync(`airways/${airways.name}.json`)) {
              console.log(
                chalk.bgRed.black("Essa aerovia ja existe, escolha outro nome!")
              );
              listAirways();
              return;
            }

            const airwaysJSON = JSON.stringify(airways, null, 2);

            fs.writeFileSync(
              `airways/${airways.name}.json`,
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
              message: "Digite o nome da aerovia que deseja buscar:",
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
              choices: ["Aeronaves Particulares", "Aeronaves Comercial"],
            },
          ])
          .then((answers) => {
            const option = answers["optionListAircraft"];

            let directoryPath = "";

            if (option === "Aeronaves Particulares") {
              directoryPath = "./aircrafts/private";
            } else {
              directoryPath = "./aircrafts/commercial";
            }

            if (!fs.existsSync(directoryPath)) {
              console.log(
                chalk.bgRed.black("Nenhuma aeronave desse tipo no sistema!")
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

                  console.log(
                    `Aeronave -  ${jsonFile.replace(".json", "")}:`,
                    jsonData
                  );
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

            const typeFormated = type.toLowerCase();

            if (typeFormated === "particular") {
              inquirer
                .prompt([
                  {
                    name: "Maintenance",
                    message: "Manutenção:",
                  },
                ])
                .then((answers) => {
                  const maintenance = answers["Maintenance"];

                  const aircraft = new newAircraft(
                    prefix,
                    type,
                    cruisingSpeed,
                    autonomy,
                    maintenance
                  );

                  if (!fs.existsSync("aircrafts")) {
                    fs.mkdirSync("aircrafts");
                  }

                  if (!fs.existsSync("aircrafts/private")) {
                    fs.mkdirSync("aircrafts/private");
                  }

                  if (
                    fs.existsSync(`aircrafts/private/${aircraft.prefix}.json`)
                  ) {
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
                    `aircrafts/private/${aircraft.prefix}.json`,
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
            } else if (typeFormated === "comercial") {
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

                  const aircraft = new newAircraftCommercial(
                    prefix,
                    type,
                    cruisingSpeed,
                    autonomy,
                    cia,
                    weightMax,
                    passagersMax
                  );

                  if (!fs.existsSync("aircrafts")) {
                    fs.mkdirSync("aircrafts");
                  }

                  if (!fs.existsSync("aircrafts/commercial")) {
                    fs.mkdirSync("aircrafts/commercial");
                  }

                  if (
                    fs.existsSync(
                      `aircrafts/commercial/${aircraft.prefix}.json`
                    )
                  ) {
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
                    `aircrafts/commercial/${aircraft.prefix}.json`,
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
        choices: ["Cadastrar piloto", "Pilotos", "Buscar Piloto", "Voltar"],
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
            const qualification = answers["Qualification"];

            const pilot = new newPilot(registration, name, qualification);

            if (!fs.existsSync("pilots")) {
              fs.mkdirSync("pilots");
            }

            if (fs.existsSync(`pilots/${pilot.name}.json`)) {
              console.log(chalk.bgRed.black("Esse piloto já está cadastrado!"));
              pilotService();
              return;
            }

            const pilotJSON = JSON.stringify(pilot, null, 2);

            fs.writeFileSync(`pilots/${pilot.name}.json`, pilotJSON, (err) => {
              console.log(err);
            });

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

          jsonFiles.forEach((jsonFile) => {
            const filePath = path.join(directoryPath, jsonFile);

            fs.readFile(filePath, "utf8", (err, data) => {
              if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return;
              }

              const jsonData = JSON.parse(data);

              console.log(`Piloto ${jsonFile.replace(".json", "")}:`, jsonData);
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
              message: "Qual piloto deseja localizar?",
            },
          ])
          .then((answers) => {
            const namePilot = answers["namePilot"];

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
                  pilotService();
                } catch (parseError) {
                  console.log("Erro em converter para string!", parseError);
                  return;
                }
              });
            }
          })
          .catch((err) => console.log(err));
      } else if ((option = "Voltar")) {
        commandTower();
      }
    })
    .catch((err) => console.log(err));
};

/*Opção - Listar altitudes Lives */
const listFreeAltitudes = () => {
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

    jsonFiles.forEach((jsonFile) => {
      const filePath = path.join(directoryPath, jsonFile);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Erro ao ler o arquivo:", err);
          return;
        }

        const alt = [
          25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000,
          35000,
        ];

        alt.forEach((alti) => {
          if ((jsonFile.altitude = alti)) {
            console.log(`Altitude livre: ${alti}`);
          }
        });
        commandTower();
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
            {
              name: "Slots",
              message: "Slots:",
            },
          ])
          .then((answers) => {
            const pilotEnrollment = answers["PilotEnrollment"];
            const pilotPrefix = answers["PilotPrefix"];
            const date = answers["Date"];
            const hour = answers["Hour"];
            const idAirways = answers["IDAirways"];
            const altitude = answers["Altitude"];
            const slot = answers["Slots"];

            const fightPlan = new newFightPlan(
              pilotEnrollment,
              pilotPrefix,
              date,
              hour,
              idAirways,
              altitude,
              slot
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

/*Opção - Listar planos de voo */
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

    jsonFiles.forEach((jsonFile) => {
      const filePath = path.join(directoryPath, jsonFile);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Erro ao ler o arquivo:", err);
          return;
        }

        const jsonData = JSON.parse(data);

        console.log(`Plano -  ${jsonFile.replace(".json", "")}:`, jsonData);
        commandTower();
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
              deleteFlightPlan();
              return;
            }

            fs.unlinkSync(`fightPlan/${plan}.json`, (err) => {
              if (err) {
                console.log("Erro", err);
              }

              console.log(
                chalk.bgGreen.black("Plano de voo apagado com sucesso!")
              );

              deleteFlightPlan();
              return;
            });
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};
