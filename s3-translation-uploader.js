const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const translate = new AWS.Translate();

exports.handler = async (event) => {

    let sourceData = event.data;
    let sourceLanguage = event.language;
    let fileName = event.filename;
    let s3Content = await translateInputData();

    async function translateInputData() {
        try {
            let data = await translate.translateText({
                SourceLanguageCode: sourceLanguage,
                TargetLanguageCode: "en",
                Text: sourceData
            }).promise();

            let translateText = data.TranslatedText;
            console.log(translateText);
            return (translateText);

        } catch (err) {
            msg = `Unable to translate input data due to an error: ${err}`;
            console.log(msg);
            throw(err);
        };
    }

    try {
        let data = await s3.putObject({
            Bucket: "translator.sample.bucket",
            Key: fileName,
            Body: s3Content,
            Metadata: {}
        }).promise();
        console.log(data);
        return { "message": "Translated Text : "+ s3Content };

    } catch (err) {
            msg = `Unable to save the object in to the S3 bucket: ${err}`;
            console.log(msg);

    };

    //return { "message": "Successfully executed" };
};