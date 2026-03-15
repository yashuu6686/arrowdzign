pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yashpaladiya/demo-app:latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/yashuu6686/arrowdzign.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }


        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image') {
    steps {
        retry(3) {
            withCredentials([usernamePassword(
                credentialsId: 'Docker',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {
                sh 'docker logout || true'
                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                sh "docker push ${env.DOCKER_IMAGE}"
            }
        }
    }
}

        stage('Deploy') {
            steps {
                sh "docker stop demo-app || true"
                sh "docker rm demo-app || true"
                sh "docker run -d -p 3000:3000 --name demo-app ${env.DOCKER_IMAGE}"
            }
        }

    }

   post {
    success {
        emailext(
            subject: "✅ Build Success - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            mimeType: 'text/html',
            body: """
            <html>
            <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
            
            <div style="max-width:600px;margin:auto;background:white;border-radius:10px;
                        box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
            
                <div style="background:#4CAF50;color:white;padding:20px;font-size:20px;">
                    🚀 Jenkins Build Successful
                </div>

                <div style="padding:20px;">
                    
                    <p><b>Project:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> SUCCESS</p>
                    <p><b>Build URL:</b></p>

                    <a href="${env.BUILD_URL}" 
                       style="background:#4CAF50;color:white;padding:10px 15px;
                              text-decoration:none;border-radius:5px;">
                       View Build
                    </a>

                </div>

                <div style="background:#f1f1f1;padding:10px;text-align:center;font-size:12px;">
                    Jenkins CI/CD Pipeline Notification
                </div>

            </div>

            </body>
            </html>
            """,
            to: "yashp.dequity@gmail.com"
        )
    }

    failure {
        emailext(
            subject: "❌ Build Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            mimeType: 'text/html',
            body: """
            <html>
            <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
            
            <div style="max-width:600px;margin:auto;background:white;border-radius:10px;
                        box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
            
                <div style="background:#e53935;color:white;padding:20px;font-size:20px;">
                    ❌ Jenkins Build Failed
                </div>

                <div style="padding:20px;">
                    
                    <p><b>Project:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> FAILED</p>

                    <a href="${env.BUILD_URL}" 
                       style="background:#e53935;color:white;padding:10px 15px;
                              text-decoration:none;border-radius:5px;">
                       Check Logs
                    </a>

                </div>

                <div style="background:#f1f1f1;padding:10px;text-align:center;font-size:12px;">
                    Jenkins CI/CD Pipeline Notification
                </div>

            </div>

            </body>
            </html>
            """,
            to: "yashp.dequity@gmail.com"
        )
    }
}
}