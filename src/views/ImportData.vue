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
      <b-field class="mt-5">
        <h5 class="subtitle is-6" v-show="isShowResult">Import {{fileName}} successfully!</h5>
      </b-field>
      <b-field class="mt-5">
        <b-button label="Download error list" class="mr-3" type="is-primary" @click="downloadErrorListExcel" v-show="errorList.length>0 &&isShowResult"/>
      </b-field>
      
    </section>
  </div>
</template>

<script>
//import XLSX from 'xlsx';
//import readXlsxFile from "read-excel-file";
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
      model: {
        customerList: [],
      },
      errorList: [],
      adminScores: [],
      adminScoreTitles: [],
      isLoadProcessExcel: false,
      isLoading: false,
      isShowResult:false
    };
  },
  watch: {},
  methods: {
    getAdminScoreList() {
      //this.isLoading = true;
      getAdminScores()
        .then((response) => {
          if (response.status == 200) {
            this.adminScores = response.data;
            this.adminScoreTitles = this.adminScores.map((p) =>
              p.scoreTitle.toLowerCase()
            );
            //console.log(this.adminScoreTitles);
            //console.log(this.adminScores);
          } else if (response.status == 401) {
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {
          //console.log(error);
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
    // readFileData(data) {
    //   this.isLoadProcessExcel=true;
    //   this.isShowResult=false;
    //   this.errorList = [];
    //   this.model.customerList=[];
    //   const schema = {
    //     "Date Occurred": {
    //       prop: "dateOccurred",
    //       type: String,
    //     },
    //     "Customer Mobile No": {
    //       prop: "customerMobileNo",
    //       type: String,
    //     },
    //     "Score Title": {
    //       prop: "scoreTitle",
    //       type: String,
    //     },
    //   };
    //   const inputFormat = "DD/MM/YYYY";
    //   const outputFormat = "YYYY-MM-DD";
    //   var isValidDate = true;
    //   var isValidPhoneNumber = true;
    //   var isValidScoreTiltles = true;
    //   readXlsxFile(data, { schema }).then(({ rows, errors }) => {
    //     rows.forEach((item, index) => {
    //       isValidScoreTiltles = this.adminScoreTitles.some((value) =>
    //         value.includes(item.scoreTitle.toLowerCase())
    //       );
    //       isValidDate = moment(item.dateOccurred,inputFormat,true).isValid();
    //       isValidPhoneNumber = this.checkValidPhoneNumber(
    //         item.customerMobileNo
    //       );
    //       item.dateOccurred = moment(item.dateOccurred,inputFormat).format(outputFormat);
    //       if (!isValidDate)
    //         this.errorList.push(`Cell A${index} - date invalid`);

    //       if (!isValidPhoneNumber)
    //         this.errorList.push(`Cell B${index} - mobile number invalid`);

    //       if (!isValidScoreTiltles)
    //         this.errorList.push(`Cell C${index} - score title invalid`);

    //       if (isValidScoreTiltles && isValidDate && isValidPhoneNumber) {
    //         this.model.customerList.push(item);
    //       }
    //     });
    //     console.log('customerList:'+this.model.customerList.length);
    //     //console.log(this.errorList);
    //     this.isLoadProcessExcel=false;
    //   });
    // },
    importData() {
      this.isLoading = true;
      this.isShowResult=false;
      //console.log(this.model);
      let formData = new FormData();
      formData.append('file', this.file);
      importCustomerScore(formData)
        .then((response) => {
          if (response.status == 200) {
            this.isShowResult = true;
            this.errorList= response.data;
            this.$buefy.snackbar.open({
              message: `Import ${this.fileName} successfully!`,
              queue: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$buefy.snackbar.open({
            message: error.error,
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
