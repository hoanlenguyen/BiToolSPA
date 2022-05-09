<template>
  <div>
    <section class="section is-main-section">
      <b-field grouped>
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
                <b-button label="Search" type="is-primary" @click="getCustomerList"/>
            </p>
           <p class="control">
                <b-button label="Reset" type="is-dark"  @click="resetFilter"/>
            </p>
        </b-field>         
      </b-field>
    </section>
  </div>
</template>

<script>
import { getAdminScores } from "@/api/importData";
import { getCustomers } from "@/api/exportData";
export default {
  name: "ExportData",
  components: {},
  created() {
    this.getAdminScoreList();
  },
  data() {
    return {
      adminScores: [
        {
          scoreID: 1,
          scoreCategory: "Occurance",
          scoreTitle: "LS",
          points: 1,
          status: 1,
          lastUpdatedBy: 0,
          lastUpdatedON: "2022-04-07T07:16:04",
        },
      ],
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
      customerList:[]
    };
  },
  methods: {
    resetFilter(){
       this.filter={...this.defaultFilter};
       this.customerList=[];
    },
    getAdminScoreList() {
      //this.isLoading = true;
      getAdminScores(this.model)
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
    getCustomerList() {
      //this.isLoading = true;
      getCustomers(this.filter)
        .then((response) => {
          if (response.status == 200) {
            this.customerList= response.data;
            console.log("customerList.length" +this.customerList.length);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
        });
    },
  },
};
</script>
