// dependencies
const ENV = require('./config.json');
const { Constants } = require('./constants');

// services
const { KsqlService } = require('./services/ksql-service');
const { FileService } = require('./services/file-service');

// main method
main(Constants.TableType, 0).then(r => console.log('DONE!'));

// functions
async function main(type, step) {
    const ksqlService = new KsqlService(ENV.KsqlUrl);
    const fileService = new FileService();

    const ksqlResources = await fileService.readJsonFileAsync(ENV.SourcePath);
    await ksqlService.terminateQueriesAsync();

    let counter = 0;
    for (const item of ksqlResources) {
        if (counter < step) {
            console.log(`Ignored ${item.name}`);
        }
        else {
            console.log(`Working on item (${counter})`);
            try {
                const isDeleteTopic = !item.topic.includes('historical-db');
                await ksqlService.dropResourceAsync(item.name, type, isDeleteTopic);

                const creatQuery = item.statement
                    .replace("historical-db.caiwbs_core_qc", "historical-db.bouwstraat_migrate")
                    .replace("historical-db.caiwbs_auth", "historical-db.bouwstraat_auth");
                await ksqlService.createResourceAsync(creatQuery);
            }
            catch (err) {
                if (err.message.includes("Could not find source to delete topic for"))
                    console.log("Cannot find source to delete topic.");
                else
                    throw err;
            }
        }
        counter++;
    }
    console.log('Migrate successfully.');
}
