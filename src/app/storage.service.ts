import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';
import * as crypto from 'crypto-js';
import axios, { CancelToken } from 'axios';
import { Signer } from 'aws-sdk';

export enum AWSconfig {
  accessKeyId = 'AKIA2LMVRCLTP6R7QJUC',
  secretAccessKey = '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',
  region = 'us-east-1',
  bucketName = 'leo-private-test',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  s3 = new S3({
    accessKeyId: AWSconfig.accessKeyId,
    secretAccessKey: AWSconfig.secretAccessKey,
    region: AWSconfig.region,
  });

  constructor() { }


  getImage() {
    Signer
    var bucketParams = {
      Bucket: AWSconfig.bucketName,
    };

    // Call S3 to obtain a list of the objects in the bucket
    this.s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data);
      }
    });

    // this.s3.getObject()
  }

  async getPresignedUrl(resourceUrl: string = 'video.mp4'): Promise<string> {
    // Key: 'users/jidrrx1UeifVapn5YmmNI5Ib6dA2/myMedia/vw6yUUSabAE5FOGcO4bn/video-transcoded/high-quality00001.jpg'
    //: 'users/jidrrx1UeifVapn5YmmNI5Ib6dA2/myMedia/1kWVAXR2b8eeIQ1cSHIx/video.mp4'

    console.log(resourceUrl);
    const urlPrepare: string[] = resourceUrl.split('amazonaws.com/');
    const key: string = urlPrepare.pop() || '';
    // const key: string = 'users/jidrrx1UeifVapn5YmmNI5Ib6dA2/myMedia/iG4LwF3vmr6iZiWsJb14/video-transcoded/playlist.m3u8'

    const data = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: AWSconfig.bucketName,
      Key: key,
      Expires: 3600,
    });

    console.log(data);
    return data;
  }

  async send() {
    const access_key = AWSconfig.accessKeyId;
    const secret_key = AWSconfig.secretAccessKey;
    const method = 'GET';
    const service = 's3';
    const host = 'leo-private-test.s3.amazonaws.com';
    const region = 'us-east-1';
    const base = 'https://';
    const content_type = 'application/json';


    // var region = '';
    // var method = 'GET';
    // var service = 's3';
    // var host = '';
    var endpoint = 'https://leo-private-test.s3.amazonaws.com';
    // var request_parameters = '';
    // const content_type = 'application/json';


    // var access_key = 
    // var secret_key = 

    const amz_date = moment().utc().format("yyyyMMDDTHHmmss") + "Z"
    const date_stamp = moment().utc().format("yyyyMMDD")

    // ************* TASK 1: CREATE A CANONICAL REQUEST *************
    var canonical_uri = '/perfil.png';
    // var canonical_querystring = request_parameters;
    // var payload_hash = sha256("");

    // DynamoDB requires an x-amz-target header that has this format:
    //     DynamoDB_<API version>.<operationName>
    const amz_target = '';

    function getSignatureKey(
      key: string,
      dateStamp: string,
      regionName: string,
      serviceName: string
    ) {
      var kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key);
      var kRegion = crypto.HmacSHA256(regionName, kDate);
      var kService = crypto.HmacSHA256(serviceName, kRegion);
      var kSigning = crypto.HmacSHA256('aws4_request', kService);
      return kSigning;
    }

    // ************* TASK 1: CREATE A CANONICAL REQUEST *************
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

    // Step 1 is to define the verb (GET, POST, etc.)--already done.

    // Step 2: Create canonical URI--the part of the URI from domain to query
    // string (use '/' if no path)
    // Create a date for headers and the credential string

    // const  = moment().utc().format('yyyyMMDDThhmmss') + 'Z';
    // const  = moment().utc().format('yyyyMMDD');

    //// Step 3: Create the canonical query string. In this example, request
    // parameters are passed in the body of the request and the query string
    // is blank.
    const canonical_querystring = '';

    //## DOing step 6 first so that I can include the payload hash in the cannonical header, per https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html
    // Step 6: Create payload hash. In this example, the payload (body of
    // the request) contains the request parameters.
    //const payload_hash = hashlib.sha256(request_parameters.encode('utf-8')).hexdigest()
    const payload_hash = crypto.SHA256('');

    // Step 4: Create the canonical headers. Header names must be trimmed
    // and lowercase, and sorted in code point order from low to high.
    // Note that there is a trailing \n.
    const canonical_headers =
      'host:' +
      host +
      '\n' +
      'x-amz-content-sha256:' +
      payload_hash +
      '\n' +
      'x-amz-date:' +
      amz_date +
      '\n';

    // Step 5: Create the list of signed headers. This lists the headers
    // in the canonical_headers list, delimited with ";" and in alpha order.
    // Note: The request can include any headers; canonical_headers and
    // signed_headers include those that you want to be included in the
    // hash of the request. "Host" and "x-amz-date" are always required.
    const signed_headers = 'host;x-amz-content-sha256;x-amz-date';

    // Step 7: Combine elements to create canonical request
    const canonical_request =
      method +
      '\n' +
      canonical_uri +
      '\n' +
      canonical_querystring +
      '\n' +
      canonical_headers +
      '\n' +
      signed_headers +
      '\n' +
      payload_hash;

    // ************* TASK 2: CREATE THE STRING TO SIGN*************
    // Match the algorithm to the hashing algorithm you use, either SHA-1 or
    // SHA-256 (recommended)
    const algorithm = 'AWS4-HMAC-SHA256';
    const credential_scope =
      date_stamp + '/' + region + '/' + service + '/' + 'aws4_request';
    const string_to_sign =
      algorithm +
      '\n' +
      amz_date +
      '\n' +
      credential_scope +
      '\n' +
      crypto.SHA256(canonical_request);

    // ************* TASK 3: CALCULATE THE SIGNATURE *************
    // Create the signing key using the function defined above.
    const signing_key = getSignatureKey(
      secret_key,
      date_stamp,
      region,
      service
    );

    // Sign the string_to_sign using the signing_key
    const signature = crypto.HmacSHA256(string_to_sign, signing_key);
    // ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
    // Put the signature information in a header named Authorization.
    const authorization_header =
      algorithm +
      ' ' +
      'Credential=' +
      access_key +
      '/' +
      credential_scope +
      ', ' +
      'SignedHeaders=' +
      signed_headers +
      ', ' +
      'Signature=' +
      signature;

    // For DynamoDB, the request can include any headers, but MUST include "host", "x-amz-date",
    // "x-amz-target", "content-type", and "Authorization". Except for the authorization
    // header, the headers must be included in the canonical_headers and signed_headers values, as
    // noted earlier. Order here is not significant.
    const headers = {
      'X-Amz-Content-Sha256': payload_hash.toString(),
      'X-Amz-Date': amz_date,
      //'X-Amz-Target':amz_target,
      Authorization: authorization_header,
      'Content-Type': content_type,
    };

    // ************* SEND THE REQUEST *************
    var response = await axios({
      method: method,
      baseURL: base + host,
      url: canonical_uri,
      // data: request_parameters,
      headers: headers,
    });
    console.log(response)
  }


  prueba3() {
    function sign(key: any, msg: any) {
      return crypto.HmacSHA256(key, msg);
    }

    function getSignatureKey(key: any, dateStamp: any, regionName: any, serviceName: any) {
      var kDate = sign(dateStamp, 'AWS4' + key);
      var kRegion = sign(regionName, kDate);
      var kService = sign(serviceName, kRegion);
      var kSigning = sign('aws4_request', kService);

      return kSigning;
    }

    function sha256(str: any) {
      return crypto.SHA256(str);
    }

    // ************* REQUEST VALUES *************
    var method = 'GET';
    var service = 's3';
    var host = 'leo-private-test.s3.amazonaws.com';
    var region = 'us-east-1';
    var endpoint = 'https://leo-private-test.s3.amazonaws.com';
    var request_parameters = '';
    const content_type = 'application/json';


    var access_key = AWSconfig.accessKeyId;
    var secret_key = AWSconfig.secretAccessKey;

    const amzdate = moment().utc().format("yyyyMMDDTHHmmss") + "Z"
    const datestamp = moment().utc().format("yyyyMMDD")

    // ************* TASK 1: CREATE A CANONICAL REQUEST *************
    var canonical_uri = '/perfil.png';
    var canonical_querystring = request_parameters;
    var payload_hash = sha256("");

    var canonical_headers =
      'host:' + host + '\n' + 'x-amz-content-sha256:' + payload_hash + '\n' + 'x-amz-date:' + amzdate + '\n';
    var signed_headers = 'host;x-amz-content-sha256;x-amz-date';

    var canonical_request =
      method +
      '\n' +
      canonical_uri +
      '\n' +
      canonical_querystring +
      '\n' +
      canonical_headers +
      '\n' +
      signed_headers +
      '\n' +
      payload_hash;

    // ************* TASK 2: CREATE THE STRING TO SIGN*************
    var algorithm = 'AWS4-HMAC-SHA256';
    var credential_scope =
      datestamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var string_to_sign =
      algorithm +
      '\n' +
      amzdate +
      '\n' +
      credential_scope +
      '\n' +
      sha256(canonical_request);

    // ************* TASK 3: CALCULATE THE SIGNATURE *************
    var signing_key = getSignatureKey(secret_key, datestamp, region, service);
    var signature = sign(signing_key, string_to_sign);

    // ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
    var authorization_header =
      algorithm +
      ' ' +
      'Credential=' +
      access_key +
      '/' +
      credential_scope +
      ', ' +
      'SignedHeaders=' +
      signed_headers +
      ', ' +
      'Signature=' +
      signature;
    var headers = {
      'x-amz-date': amzdate,
      'x-amz-content-Sha256': payload_hash.toString(),
      Authorization: authorization_header,
      host: host,
      'Content-Type': content_type
    };
    var request_url = endpoint + '/' + canonical_uri //'?' + canonical_querystring;

    axios.get(request_url, {
      headers
    })

    // var options = {
    //   url: request_url,
    //   headers: headers,
    // };

    // request(options, function (err, res) {
    //   console.log(res.statusCode, res.body);
    // });
  }
}
