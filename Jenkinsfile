pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "yashpaladiya/demo-app"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE = "${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
        DOCKER_LATEST = "${DOCKER_IMAGE_NAME}:latest"
        DOCKER_CREDENTIALS_ID = 'Docker'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Using scm instead of hardcoded git makes it more flexible for different branches
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the image using the optimized Dockerfile
                    // This handles dependencies and build internally
                    sh "docker build -t ${env.DOCKER_IMAGE} -t ${env.DOCKER_LATEST} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    retry(3) {
                        withCredentials([usernamePassword(
                            credentialsId: env.DOCKER_CREDENTIALS_ID,
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                            sh "docker push ${env.DOCKER_IMAGE}"
                            sh "docker push ${env.DOCKER_LATEST}"
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // deployment logic
                    sh "docker stop demo-app || true"
                    sh "docker rm demo-app || true"
                    sh "docker run -d -p 3000:3000 --name demo-app ${env.DOCKER_LATEST}"
                }
            }
        }
    }

    post {
        always {
            // Clean up images from the Jenkins agent to save space
            sh "docker rmi ${env.DOCKER_IMAGE} || true"
            // Keep the latest locally if needed, or remove it too
            // sh "docker rmi ${env.DOCKER_LATEST} || true"
            sh "docker image prune -f"
        }
        success {
            sendEmailNotification("✅ Build Success")
        }
        failure {
            sendEmailNotification("❌ Build Failed")
        }
    }
}

// Helper function to keep the pipeline clean
def sendEmailNotification(String statusLabel) {
    emailext(
        subject: "${statusLabel} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        mimeType: 'text/html',
        body: """
        <html>
        <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
                <div style="background:${statusLabel.contains('Success') ? '#4CAF50' : '#e53935'};color:white;padding:20px;font-size:20px;">
                    ${statusLabel}
                </div>
                <div style="padding:20px;">
                    <p><b>Project:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
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