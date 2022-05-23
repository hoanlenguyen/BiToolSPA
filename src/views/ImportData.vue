<template>
  <div>
    <section class="section is-main-section">
      <b-field class="file is-primary" :class="{ 'has-name': !!file }" >
        <b-upload v-model="file" class="file-label" @change.native="isShowResult=false; fileName=file?file.name:''" 
          accept=".xlsx, .xls, .csv" required validationMessage="Please select correct file type">
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload" ></b-icon>
            <span class="file-label" >Click to upload</span>
          </span>
          <span class="file-name" v-if="file">
            {{ file.name }}
          </span>
        </b-upload>
      </b-field>

      <b-field class="mt-5">
        <b-button type="is-info" @click="importData" :loading="isLoading" :disabled="!file" label="Import Data" 
          icon-left="database-import"/>
      </b-field>
      <b-field class="mt-5" v-show="isShowResult">
        <h5 class="subtitle is-6">Import {{fileName}} successfully!</h5>
      </b-field>
       <div class="mt-5" v-show="isShowResult">
        <h5 class="subtitle is-6" >Total rows: <strong>{{totalRows}}</strong></h5>
        <h5 class="subtitle is-6" >Total imported rows: <strong>{{totalImportedRows}}</strong></h5>
        <h5 class="subtitle is-6" >Total error rows: <strong>{{totalErrorRows}}</strong></h5>
      </div>
      <b-field class="mt-5"  v-show="errorList.length>0 &&isShowResult">
        <b-button label="Download error list" class="mr-3" type="is-primary" @click="downloadErrorListExcel"/>
      </b-field>
      
    </section>
  </div>
</template>

<script>
import moment from "moment";
import { importCustomerScore, getAdminScores } from "@/api/importData";
export default {
  name: "ImportData",
  components: {},
  created() {
    //this.getAdminScoreList();
  },
  data() {
    return {
      file: null,
      fileName:'',
      totalRows:0,
      totalErrorRows:0,
      totalImportedRows:0,
      errorList: [],
      adminScores: [],      
      isLoadProcessExcel: false,
      isLoading: false,
      isShowResult:false
    };
  },
  watch: {},
  methods: {
    getAdminScoreList() {
      getAdminScores()
        .then((response) => {
          if (response.status == 200) {
            this.adminScores = response.data;             
          } else if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
        })
        .finally(() => {
        });
    },     
    importData() {
      this.isLoading = true;
      this.isShowResult=false;
      let formData = new FormData();
      formData.append('file', this.file);
      importCustomerScore(formData)
        .then((response) => {
          if (response.status == 200) {
            this.isShowResult = true;
            var data = response.data;
            if(data){
              this.errorList= data.errorList;
              this.totalRows= data.totalRows;
              this.totalErrorRows= this.errorList.length;
              this.totalImportedRows= this.totalRows- this.totalErrorRows;
            }            
            this.$buefy.snackbar.open({
              message: `Import ${this.fileName} successfully!`,
              queue: false,
            });
          }
        })
        .catch((error) => {
          this.$buefy.snackbar.open({
            message: error,
            queue: false,
            type: 'is-warning'
          });
        })
        .finally(() => {
          this.isLoading = false;
          this.file=null;
        });
    },
    downloadErrorListExcel() {
      console.log("downloadErrorListExcel");
      if (this.errorList.length > 0) 
         this.exportExcelData(this.errorList, "ErrorList", 30);
    },
    checkValidPhoneNumber(input) {
      if(!input) return false;
      if (input.length != 9) return false;
      var firstChar = input[0];
      if (firstChar != "6" && firstChar != "8" && firstChar != "9")
        return false;
      const parsed = parseInt(input);
      return !isNaN(parsed);
    }
  },
};
</script>
