#!groovy

def workerNode = "devel8"

void notifyOfBuildStatus(final String buildStatus) {
    final String subject = "${buildStatus}: ${env.JOB_NAME} ${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    final String details = """<p> Job '${env.JOB_NAME} [${env.BRANCH_NAME}-${env.BUILD_NUMBER}]':</p>
        <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BRANCH_NAME}-${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
    emailext(
        to: "$mailRecipients",
        subject: "$subject",
        body: "$details", attachLog: true, compressLog: false,
        mimeType: "text/html",
        recipientProviders: [[$class: "CulpritsRecipientProvider"]]
    )
}

pipeline {
    agent {label workerNode}
    environment {
        MARATHON_TOKEN = credentials("METASCRUM_MARATHON_TOKEN")
        mailRecipients = "jsj@dbc.dk, jbr@dbc.dk, jbn@dbc.dk, atm@dbc.dk, mib@dbc.dk, vn@dbc.dk"
    }
    triggers {
        pollSCM("H/03 * * * *")
    }
    options {
        timestamps()
    }
    stages {
        stage("install") {
            steps {
                // use npm since build machine doesn't have yarn
                sh "npm install"
            }
        }
        stage("unit testing") {
            steps {
                sh "npm test"
            }
        }
        stage("docker build") {
            steps {
                script {
                    def image = docker.build("docker-io.dbc.dk/merkur:${env.BRANCH_NAME}-${env.BUILD_NUMBER}")
                    image.push()
                }
            }
        }
    }
    post {
        failure {
            notifyOfBuildStatus("build failed")
        }
        unstable {
            notifyOfBuildStatus("build became unstable")
        }
    }
}
