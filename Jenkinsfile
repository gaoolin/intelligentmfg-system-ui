pipeline {
    agent {
        node {
            label 'nodejs'
        }
    }

    stages {
        stage('拉取代码') {
            agent none
            steps {
                container('nodejs') {
                    git(url: 'https://codeup.aliyun.com/6355e32a0e55ca746598544d/qtech-datadev/RuoYi-ui.git', credentialsId: 'codeup-id', branch: 'master', changelog: true, poll: false)
                    sh '''echo "*****************打印当前路径*****************"
													ls -al'''
                }
            }
        }

        stage('项目编译') {
            agent none
            steps {
                container('nodejs') {
										sh 'npm install --registry=https://registry.npm.taobao.org'
                    sh 'npm run build:prod'
										sh '''echo "**********打印当前路径**************"
													ls -al'''
                }
            }
        }

        stage('项目构建') {
            agent none
            steps {
                container('nodejs') {
                    sh 'ls'
										sh 'docker build -t ruoyi-ui:latest -f Dockerfile .'
                }
            }
        }

        stage('推送最新镜像') {
            agent none
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME', credentialsId: "$DOCKER_CREDENTIAL_ID",)]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
												sh 'docker tag ruoyi-ui:latest $REGISTRY/$DOCKERHUB_NAMESPACE/ruoyi-ui:latest'
                        sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/ruoyi-ui:latest'
                    }
                }
            }
        }

        stage('部署到生产环境') {
            steps {
                container('nodejs') {
//                    input(id: 'deploy-to-production', message: 'deploy to production?')

                    withCredentials([kubeconfigContent(credentialsId: "$KUBECONFIG_CREDENTIAL_ID", variable: 'KUBECONFIG_CONFIG',)]) {
                        sh 'mkdir -p ~/.kube/'
                        sh 'echo "$KUBECONFIG_CONFIG" > ~/.kube/config'
                        sh 'ls'
                        sh 'pwd'

												sh 'envsubst < ./deploy/deploy.yaml | kubectl apply -f -'
                    }
//                    kubernetesDeploy(configs: 'qtech-auth/deploy/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
                }
            }
        }
    }

    environment {
        DOCKER_CREDENTIAL_ID = 'ali-docker-repos'
        GITHUB_CREDENTIAL_ID = 'codeup-id'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-id'
        REGISTRY = 'registry.cn-shanghai.aliyuncs.com'
        DOCKERHUB_NAMESPACE = 'qtech'
        GITHUB_ACCOUNT = 'kubesphere'
        KUBE_NAME_SPACE = 'ruoyi'
    }
}
