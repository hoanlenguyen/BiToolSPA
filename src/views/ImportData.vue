<template>
  <div>
    <section class="section is-main-section">
      <b-field class="file is-primary" :class="{'has-name': !!file}">
        <b-upload v-model="file" class="file-label">
            <span class="file-cta">
                <b-icon class="file-icon" icon="upload"></b-icon>
                <span class="file-label">Click to upload</span>
            </span>
            <span class="file-name" v-if="file">
                {{ file.name }}
            </span>
        </b-upload>
      </b-field>
      <b-button type="is-info" @click="importData">Import Data</b-button>
    </section>
  </div>
</template>

<script>
//import XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';
import moment from 'moment';
import { importCustomerScore } from "@/api/importData";
export default {
  name: "ImportData",
  components: {
  },
  data() {
    return {
      file: null,
      model:{
        customerList:[]
      },
      errorList:[]
    };
  },
  watch:{
    file(val){
      if(val){
        this.readFileData(val);
      }
    }
  },
  methods: {
    readFileData(data){
      //console.log(data);
      // var workbook = XLSX.read(this.file, { type: 'binary' })
      // let sheetName = workbook.SheetNames[0]
      // let worksheet = workbook.Sheets[sheetName]
      // let rowObject = XLSX.utils.sheet_to_row_object_array(worksheet)
      // const finalJsonData = JSON.stringify(rowObject, undefined, 4)
      // console.log(finalJsonData)
      const schema = {
        'Date Occurred': {
          prop: 'dateOccurred',
          type: String
        },
        'Customer Mobile No': {
          prop: 'customerMobileNo',
          type: String
        },
        'Score Title': {
          prop: 'scoreTitle',
          type: String
        },
      };
      const inputFormat = "DD/MM/YYYY";
      const outputFormat = "YYYY-MM-DD";
      readXlsxFile(data,{ schema }).then(({ rows, errors }) => {
        rows.forEach(element => {
          // var isValidDate = moment(element.dateOccurred, inputFormat, true).isValid();
          // if(isValidDate){
          //   element.dateOccurred = moment(element.dateOccurred, inputFormat).format(outputFormat);
          //   this.model.customerList.push(element);
          // }
          element.dateOccurred = moment(element.dateOccurred, inputFormat).format(outputFormat);

        });
      this.model.customerList= rows;
      console.log(this.model.customerList);
      })
    },
    importData(){
      this.isLoading = true;
      importCustomerScore(this.model)
        .then((response) => {
          if (response.status==200) {
             this.$buefy.snackbar.open({
              message: "Import successfully!",
              queue: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
          // this.$buefy.snackbar.open({
          //   message: error.error,
          //   queue: false
          // });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    convertValidDate(intput){

    }
  }
};
</script>
