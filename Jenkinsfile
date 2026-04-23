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
                     -e -o target\\jmeter-report-${timestamp}
                     """
                 }
             }
         }

         stage('Archive Reports') {
             steps {
                 archiveArtifacts artifacts: 'target/**/*, allure-results/**/*', fingerprint: true
             }
         }
     }
 }