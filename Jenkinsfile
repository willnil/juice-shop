node() {
    def app

    stage('Checkout') { 
        deleteDir()
        checkout scm 
    }

    gitlabBuilds(builds: ["Build Docker Image", "Push docker image", "Run docker"]) {

	stage("Build Docker Image") {
        gitlabCommitStatus("Build Docker Image") {
            app = docker.build("devsecops/juiceshop")
        }
    }

	stage("Push docker image") {
		gitlabCommitStatus("Publish docker image") {
			docker.withRegistry('http://registry:5000', 'registry-auth') {
				app.push("${env.BUILD_NUMBER}")
	            app.push("latest")
	        }
			sh 'echo "Docker push completed"'
	  	}
	}

	stage("Run docker") {
	    gitlabCommitStatus("Run docker") {
        	sh 'docker run --rm -d -p 3000:3000 devsecops/juiceshop'
	      	sh 'echo "Docker push completed"'
    	}
	}
	
}
}
