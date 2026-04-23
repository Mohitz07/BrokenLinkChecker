pipeline {
    agent any

    environment {
        JMETER_HOME = "C:\\JMeter\\apache-jmeter-5.6.3"
    }

    stages {

        stage('Build & Run Selenium Tests') {
            steps {
                bat 'mvn clean test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']],
                       reportBuildPolicy: 'ALWAYS'
            }
        }

        stage('Run JMeter') {
            steps {
                script {
                    def timestamp = new Date().format("yyyyMMdd_HHmmss")

                    bat """
                    %JMETER_HOME%\\bin\\jmeter.bat -n ^
                    -t src\\test\\resources\\jmeter\\LoadTest.jmx ^
                    -l target\\results-${timestamp}.jtl ^
                    -e -o target\\jmeter-report-${timestamp} ^
                    -Jjmeter.save.saveservice.output_format=csv ^
                    -Jjmeter.save.saveservice.timestamp_format=ms ^
                    -Jjmeter.save.saveservice.print_field_names=true ^
                    -Jjmeter.save.saveservice.thread_name=true ^
                    -Jjmeter.save.saveservice.data_type=true ^
                    -Jjmeter.save.saveservice.latency=true ^
                    -Jjmeter.save.saveservice.connect_time=true ^
                    -Jjmeter.save.saveservice.bytes=true ^
                    -Jjmeter.save.saveservice.success=true ^
                    -Jjmeter.save.saveservice.grpThreads=true ^
                    -Jjmeter.save.saveservice.allThreads=true
                    """

                    // 🔍 Debug: Check files
                    bat "dir target"
                    bat "dir target\\jmeter-report-${timestamp}"

                    // 💡 Print report path
                    echo "JMeter Report: target/jmeter-report-${timestamp}/index.html"
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: '''
                    target/jmeter-report-*/**,
                    target/results-*.jtl,
                    allure-results/**/*
                ''', fingerprint: true
            }
        }
    }
}