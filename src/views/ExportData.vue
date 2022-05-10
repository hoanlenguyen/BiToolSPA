<template>
  <div>
    <section class="section is-main-section">
      <b-field grouped>
        <b-field label="Creation Time from">
          <b-datepicker
            placeholder="Creationtime from"
            icon="calendar-today"
            locale="en-CA"
            v-model="dateFirstAddedFrom"
            editable
          >
          </b-datepicker>
        </b-field>
        <b-field label="Creation Time to">
          <b-datepicker
            placeholder="Creationtime to"
            icon="calendar-today"
            locale="en-CA"
            v-model="dateFirstAddedTo"
            editable
          >
          </b-datepicker>
        </b-field>
        <b-field label="Admin score">
          <b-select
            placeholder="Select score title"
            v-model="filter.scoreId"
            clearable
          >
            <option
              v-for="option in adminScores"
              :value="option.scoreID"
              :key="option.scoreID"
            >
              {{ option.scoreTitle }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Mobile No">
          <b-input
            placeholder="Search mobileNo..."
            type="search"
            icon="magnify"
            v-model="filter.keyWord"
          >
          </b-input>
          <p class="control">
            <b-button
              label="Search"
              type="is-primary"
              @click="getCustomerList"
              :loading="isLoading"
            />
          </p>
          <p class="control">
            <b-button label="Reset" type="is-dark" @click="resetFilter" />
          </p>
        </b-field>
      </b-field>

      <h5 class="subtitle is-6" v-show="isShowResult">
        <span>Found {{ customerList.length }} customer mobile numbers</span>
      </h5>
      <h5 class="subtitle is-6 has-text-white" v-show="!isShowResult"><span>></span></h5>
      
      <b-field grouped>
        <p class="control">
          <b-button
            label="Download result"
            class="mr-3"
            type="is-primary"
            @click="downloadCustomerExcel"
            :disabled="isDisableDownload"
          />

          <b-button
            label="Assign campaign"
            type="is-primary"
            @click="isShowCampaign=true"
            :disabled="isDisableDownload"
          />
        </p> 
        <b-field label="Select campaign" class="control">
          <b-select
            placeholder="Select campaign"
            v-model="campaignModel.campaignID"
            clearable
          >
            <option
              v-for="option in adminCampaigns"
              :value="option.campaignID"
              :key="option.campaignID"
            >
              {{ option.campaignName }}
            </option>
          </b-select>
          <b-button
            label="Confirm"
            type="is-primary"
            @click="assignCampaignToCustomers"
            :disabled="isDisableDownload"
          />
        </b-field>       
      </b-field>      
    </section>
  </div>
</template>

<script>
import moment from "moment";
import { getAdminScores, getAdminCampaigns } from "@/api/importData";
import { getCustomers } from "@/api/exportData";
export default {
  name: "ExportData",
  components: {},
  created() {
    this.getAdminScoreList();
    this.getAdminCampaignList();
  },
  data() {
    return {
      adminScores: [],
      adminCampaigns:[],
      campaignModel:{
        customerList:[],
        campaignID:null
      },      
      filter: {
        scoreId: null,
        scoreCategory: null,
        keyWord: null,
        dateFirstAddedFrom: null,
        dateFirstAddedTo: null,
      },
      defaultFilter: {
        scoreId: null,
        scoreCategory: null,
        keyWord: null,
        dateFirstAddedFrom: null,
        dateFirstAddedTo: null,
      },
      dateFirstAddedFrom: null,
      dateFirstAddedTo: null,
      customerList: [],
      isShowResult: false,
      isLoading: false,
      isShowCampaign:false
    };
  },
  computed: {
    isDisableDownload() {
      return this.customerList.length == 0;
    },
  },
  methods: {
    resetFilter() {
      this.filter = { ...this.defaultFilter };
      this.customerList = [];
      this.dateFirstAddedFrom = null;
      this.dateFirstAddedTo = null;
      this.isShowResult = false;
      this.isShowCampaign=false
    },
    getAdminScoreList() {
      //this.isLoading = true;
      getAdminScores()
        .then((response) => {
          if (response.status == 200) {
            this.adminScores = response.data;
            console.log(this.adminScores);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
    getAdminCampaignList() {
      //this.isLoading = true;
      getAdminCampaigns()
        .then((response) => {
          if (response.status == 200) {
            this.adminCampaigns = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
    getCustomerList() {
      this.isLoading = true;
      const outputFormat = "YYYY-MM-DD";
      if (this.dateFirstAddedFrom)
        this.filter.dateFirstAddedFrom = moment(this.dateFirstAddedFrom).format(
          outputFormat
        );

      if (this.dateFirstAddedTo)
        this.filter.dateFirstAddedTo = moment(this.dateFirstAddedTo).format(
          outputFormat
        );

      getCustomers(this.filter)
        .then((response) => {
          if (response.status == 200) {
            this.customerList = response.data;            
            //console.log(this.customerList);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isShowResult = true;
          this.isLoading = false;
          this.isShowCampaign=false
        });
    },
    downloadCustomerExcel() {
      console.log("downloadCustomerExcel");      
      if (this.customerList.length > 0){
        let mobileList = this.customerList.map((p) => ({CustomerMobileNo: p,}));
        this.exportExcelData(mobileList, "CustomerMobileNo", 30);
      }
    },
    assignCampaignToCustomers(){
      
    }
  },
};
</script>
