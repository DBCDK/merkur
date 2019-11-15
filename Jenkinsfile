#!groovy

def workerNode = "devel8"

pipeline {
    agent {label workerNode}
    environment {
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
    }
    triggers {
        pollSCM("H/03 * * * *")
        upstream(upstreamProjects: "Docker-base-node-bump-trigger",
            threshold: hudson.model.Result.SUCCESS)
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
        stage("bump docker tag in merkur-deploy") {
			agent {
				docker {
					label workerNode
					image "docker.dbc.dk/build-env:latest"
					alwaysPull true
				}
			}
			when {
				branch "master"
			}
			steps {
				script {
					sh "set-new-version merkur.yml ${env.GITLAB_PRIVATE_TOKEN} metascrum/merkur-deploy ${env.BRANCH_NAME}-${env.BUILD_NUMBER} -b staging"
				}
			}
		}
    }
}
