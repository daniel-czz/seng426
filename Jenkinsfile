pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }

         stage('pull Code') {
            steps {
                git branch:'daniel_test',
                credentialsId:'73d0a3b3-226d-4ee8-98f0-427e37abcb6f',
                url:'git@git.engr.uvic.ca:seng426/2021/teams/team-13/neptunebank.git'

            }
        }

         stage('List Directories') {
            steps {
                sh 'ls -ltr'
            }
        }

         stage('Install Dependencies') {
                	steps {
                		sh 'npm install'
                	}
                }

         stage('SonarQube Scan') {
         			steps {
         				sh './mvnw sonar:sonar \
                               -Dsonar.projectKey=team-13 \
                               -Dsonar.host.url=https://sonarqube.seng.uvic.ca \
                               -Dsonar.login=50a951d809a1c3674cf82b98d37d0b4d78805af4'
         			}
         		}


		stage('Deploy and Testing'){
			parallel{
				stage('Deploy'){
                	steps{
                       timeout(time: 4, unit: 'MINUTES') {
                                sh './mvnw clean'
                                sh  './mvnw -Pdev'
                       }
                    }
                    post{
                          failure{
                               echo'DEPLOY Fail!!!'
                                                    							//updateGitlabCommitStatus name:'jenkins-unittest',state:'failed'
                               mail to:'danielczz0223@gmail.com',
                               subject:'fail on Deploy',
                               body:'something wrong with deploy'
                          }
                          aborted{
                               echo'DEPLOY Aborted!!!'
                               mail to:'danielczz0223@gmail.com',
                               subject:'Deploy Aborted',
                               body:'deploy aborted '
                          }
                    }
               }
                stage('Testing'){
                	steps {
                				 sh 'sleep 100'
                                 sh './mvnw test'
                                 sh './mvnw verify'
                    }
                    post{
                    	failure{
                    			echo'TESTING Fail!!!'
                    							//updateGitlabCommitStatus name:'jenkins-unittest',state:'failed'
                    			mail to:'danielczz0223@gmail.com',
                    			subject:'fail on testing',
                    			body:'something wrong with testing'
                    	}
                    	success{
                    			cho'TESTING SUCCESS!!!'
                    	}
                    }
                }

			}

		}


	}
}

