pipeline {
    agent any
    environment {
        USER = 'Desconocido'
        API_KEY = 'Desconocida'
    }
    options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Build and test') {
            agent {
                docker {
                    image 'node:20.11.1-alpine3.19' 
                    reuseNode true
                }
            }
            stages {
               stage('Instalar dependencias') {
                   steps {
                       sh 'npm install'
                   }
               } 
                stage('ejecucion de test') {
                   steps {
                       sh 'npm run test'
                   }
               } 
                stage('ejecucion de build') {
                   steps {
                       sh 'npm run build'
                   }
               } 
            }
        }
        /*stage('Code Quality'){
            stages {
                stage('SonarQube analysis') {
                    agent {
                        docker {
                            image 'sonarsource/sonar-scanner-cli' 
                            args '--network="devops-infra_default"'
                            reuseNode true
                        }
                    }
                    steps {
                        withSonarQubeEnv('sonarqube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
                stage('Quality Gate') {
                    steps {
                        timeout(time: 10, unit: 'SECONDS') {
                            waitForQualityGate abortPipeline: true
                        }
                    }
                }
            }
        }*/
        stage('delivery'){
            steps {
                script {
                    docker.withRegistry('http://localhost:8082', 'nexus-key') {
                        sh 'docker build -t proyecto-devops:latest .'
                        sh "docker tag proyecto-devops:latest localhost:8082/proyecto-devops:latest"
                        sh "docker tag proyecto-devops:latest localhost:8082/proyecto-devops:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                        sh 'docker push localhost:8082/proyecto-devops:latest'
                        sh "docker push localhost:8082/proyecto-devops:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                    }
                }
            }
        }
         stage('deploy kubernetes'){
             steps {
        withCredentials(bindings: [
                      string(credentialsId: 'kubernetes-jenkins', variable: 'api_token')
                      ]) {
            script {
                 def deploymentExists = sh(
                    script: "kubectl --token=$api_token --server=https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify=true get deployment proyecto-final-deployment -n devops --ignore-not-found -o jsonpath='{.metadata.name}'",
                    returnStdout: true
                ).trim()
                
                if (deploymentExists == 0) {
                    echo "Deployment existe en el namespace 'devops', actualizando imagen"
                    sh "kubectl --token $api_token --server https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify=true set image deployment proyecto-final-deployment proyecto-final=localhost:8082/proyecto-devops:latest -n devops"
                } else {
                    echo "Deployment no existe en el namespace 'devops', aplicando kubernetes.yaml"
                    sh "kubectl --token $api_token --server https://kubernetes.docker.internal:6443 --insecure-skip-tls-verify=true apply -f kubernetes.yaml"
                }
            }
          }

        }
         }
    }
}