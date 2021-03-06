**RESTful API**
-

All API calls must be equipped with a HTTP Basic authentication header with
credentials containing both agency and API key, for example:

  ```
  Authorization: Basic 123456:secret
  ```

Note that in the example above, the credentials part is shown in clear text
for readability but must in a real life scenario be base64 encoded.

Failure to supply a valid header will result in a `401 Unauthorized` response.

Note that the sample calls in this documentation all use the cURL command line
tool, but any tool or library capable of working with the HTTP protocol can be
applied.

**List files**
----
  Lists information about all files available.
  
  All file entries contain a download url for actual file content retrieval,
  but only unclaimed files also have a claimed url for file retrieval
  acknowledgement.

  To single out files originating from the conversion service (in danish 
  "konverteringsservice") use `/conversions` endpoint instead of /files.

  To single out files originating from the periodic jobs service (in danish 
  "dataleverancer") use `/periodic-jobs` endpoint instead of /files.

* **URL**

  /files

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 Ok <br />
    **Content:**
    ```json
    [
        {
            "filename": "mr.krabs",
            "origin": "conversions",
            "creationTimeUTC": "2018-04-17T11:33:46.132Z",
            "byteSize": 8,
            "downloadUrl": "https://INSERT_HOSTNAME_HER/files/5000003",
            "claimedUrl": "https://INSERT_HOSTNAME_HER/files/5000003/claimed"
        },
        {
            "filename": "squidward",
            "origin": "periodic-jobs",
            "creationTimeUTC": "2018-04-17T11:33:46.074Z",
            "byteSize": 9,
            "downloadUrl": "https://INSERT_HOSTNAME_HER/files/5000004",
        },
        {
            "filename": "larry",
            "origin": "conversions",
            "creationTimeUTC": "2018-04-17T11:33:46.046Z",
            "byteSize": 5,
            "downloadUrl": "http://merkur/files/5000005",
            "claimedUrl": "http://merkur/files/5000005/claimed"
        },
        {
            "filename": "mrs.puff",
            "origin": "periodic-jobs",
            "creationTimeUTC": "2018-04-17T11:33:46.018Z",
            "byteSize": 8,
            "downloadUrl": "https://INSERT_HOSTNAME_HER/files/5000007",
            "claimedUrl": "https://INSERT_HOSTNAME_HER/files/5000007/claimed"
        }
    ]
    ```

* **Sample Call:**

  ```bash
  $ curl -v --user '123456:secret' https://INSERT_HOSTNAME_HERE/files
  ```

**List unclaimed files**
----
  Lists information about all unclaimed files available

  All file entries contain both a download url for actual file content
  retrieval and a claimed url for file retrieval acknowledgement.

  To single out files originating from the conversion service (in danish 
  "konverteringsservice") use `/conversions/unclaimed` endpoint instead of /files.

  To single out files originating from the periodic jobs service (in danish 
  "dataleverancer") use `/periodic-jobs/unclaimed` endpoint instead of /files.

* **URL**

  /files/unclaimed

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 Ok <br />
    **Content:**
    ```json
    [
        {
            "filename": "mr.krabs",
            "origin": "conversions",
            "creationTimeUTC": "2018-04-17T11:33:46.132Z",
            "byteSize": 8,
            "downloadUrl": "https://INSERT_HOSTNAME_HER/files/5000003",
            "claimedUrl": "https://INSERT_HOSTNAME_HER/files/5000003/claimed"
        },
        {
            "filename": "larry",
            "origin": "conversions",
            "creationTimeUTC": "2018-04-17T11:33:46.074Z",
            "byteSize": 5,
            "downloadUrl": "http://merkur/files/5000005",
            "claimedUrl": "http://merkur/files/5000005/claimed"
        },
        {
            "filename": "mrs.puff",
            "origin": "periodic-jobs",
            "creationTimeUTC": "2018-04-17T11:33:46.018Z",
            "byteSize": 8,
            "downloadUrl": "https://INSERT_HOSTNAME_HER/files/5000007",
            "claimedUrl": "https://INSERT_HOSTNAME_HER/files/5000007/claimed"
        }
    ]
    ```
    
* **Sample Call:**

  ```bash
  $ curl -v --user '123456:secret' https://INSERT_HOSTNAME_HERE/files/unclaimed
  ```

**Download file**
----
  Retrieves file content.
  
* **URL**

  /files/{id}

* **Method:**

  `GET`
  
*  **path Params**

   **Required:**
 
   `file id`

* **Success Response:**

  * **Code:** 200 Ok <br />
    **Content:** file content as application/octet-stream
 
* **Sample Call:**

  ```bash
  $ curl -v --user '123456:secret' https://INSERT_HOSTNAME_HERE/files/5000007
  ```

**Claim file**
----
  Acknowledges file retrieval for specific file.
  
* **URL**

  /files/{id}/claimed

* **Method:**

  `POST`
  
*  **path Params**

   **Required:**
 
   `file id`

* **Data Params**

  Empty

* **Success Response:**

  * **Code:** 200 Ok <br />
 
* **Error Response:**

  * **Code:** 403 Forbidden <br />
    **Content:** `Attempt to claim file owned by another agency`

* **Sample Call:**

  ```bash
  $ curl -v --user '123456:secret' -X POST https://INSERT_HOSTNAME_HERE/files/5000005/claimed
  ```