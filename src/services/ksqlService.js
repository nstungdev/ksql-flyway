const KsqlClient = require('ksqldb-js');

module.exports = {
    KsqlService: function (url) {
        const client = new KsqlClient({ ksqldbURL: url });
        return {
            terminateQueriesAsync: async function () {
                const result = await client.ksql('TERMINATE ALL;');
                logQueryResult(result);
            },
            createResourceAsync: async function(statement) {
                 const result = await client.ksql(statement);
                 logQueryResult(result);
            },
            dropResourceAsync: async function(resourceName, type, isDeleteTopic) {
                const dropResourceQuery
                    = `DROP ${type.toUpperCase()} IF EXISTS ${resourceName.toUpperCase()} ${isDeleteTopic ? 'DELETE TOPIC' : ''};`;
                const result = await client.ksql(dropResourceQuery);
                logQueryResult(result);
            }
        }

        function logQueryResult(result) {
            if (!result)
                return;
            console.log({
                command: result['statementText'],
                status: result['commandStatus'].status,
                message: result['commandStatus'].message
            });
        }
    }
}