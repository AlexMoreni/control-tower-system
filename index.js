const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");

class newAirways {
  constructor(name, origin, destiny, size) {
    this.id = Math.round(Math.random() * 1000);
    this.name = name;
    this.origin = origin;
    this.destiny = destiny;
    this.size = parseInt(size);
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
          "Listar altitudes livre",
          "Aprovar plano de voo",
          "Listar planos",
          "Listar ocupação",
          "Cancelar plano de voo",
          "Sair",
        ],
      },
    ])
    .then((answers) => {
      const options = answers["actions"];

      if (options === "Listar aerovias") {
        listAirways();
      } else if (options === "Listar aeronaves") {
        console.log("");
      } else if (options === "Listar altitudes livre") {
        console.log("");
      } else if (options === "Aprovar plano de voo") {
        console.log("");
      } else if (options === "Listar planos") {
        console.log("");
      } else if (options === "Listar ocupação") {
        console.log("");
      } else if (options === "Cancelar plano de voo") {
        console.log("");
      } else if (options === "Sair") {
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
