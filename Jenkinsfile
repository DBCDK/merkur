#!groovy

def workerNode = "devel8"

void deploy(String deployEnvironment) {
    dir("deploy") {
        git(url: "gitlab@git-platform.dbc.dk:metascrum/deploy.git", credentialsId: "gitlab-meta")
    }
    sh """
        marathon-config-producer merkur-${deployEnvironment} --root deploy/marathon --template-keys BRANCH_NAME=${env.BRANCH_NAME} BUILD_NUMBER=${env.BUILD_NUMBER} HEALTH_CHECK_PATH=/ -o merkur-${deployEnvironment}.json
        marathon-deployer -a ${MARATHON_TOKEN} -b https://mcp1.dbc.dk:8443 deploy merkur-${deployEnvironment}.json
    """
}

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
        stage("deploy staging") {
            when {
                branch "master"
            }
            steps {
                deploy("staging")
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
